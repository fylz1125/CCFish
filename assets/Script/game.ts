import { FishState, FishType } from './FishType';
import Fish from './Fish';
import Bullet from './Bullet';
import Net from './Net';
import CoinController from './CoinController';
import Weapon from './Weapon';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    //鱼对象池
    fishPool: cc.NodePool;
    fishTypes: FishType[];

    @property(cc.Prefab)
    fishPrefab: cc.Prefab = null;

    @property(cc.Node)
    weaponNode: cc.Node = null;    

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    netPrefab: cc.Prefab = null;

    @property(cc.Node)
    coinController: cc.Node = null;    

    oneFish: cc.Node;
    oneBullet: cc.Node;
    oneNet: cc.Node;

    //子弹对象池
    bulletPool: cc.NodePool;
    netsPool: cc.NodePool;

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.bulletPool = new cc.NodePool(Bullet);
        this.fishPool = new cc.NodePool(Fish);
        this.netsPool = new cc.NodePool();

        this.coinController.getComponent(CoinController).init();
        this.weaponNode.getComponent(Weapon).init();

        let self = this;
        cc.director.setDisplayStats(true);
        // 动态加载json配置文件
        cc.loader.loadRes("fishconfig", function (err, data) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // 加载之后转类型
            self.fishTypes = <FishType[]>data;
            self.schedule(self.creatFish, 2);
        });



        // 添加触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) { 
            //需要将触点坐标转换成局部坐标，跟炮台一致
            let touchPos = self.weaponNode.parent.convertTouchToNodeSpaceAR(event.touch);
            let weaponPos = self.weaponNode.getPosition();
            if (touchPos.y < weaponPos.y) return;
            let radian = Math.atan((touchPos.x - weaponPos.x) / (touchPos.y - weaponPos.y));
            let degree = radian * 180 / 3.14;
            self.weaponNode.rotation = degree;
            let bulletLevel = self.weaponNode.getComponent(Weapon).curLevel;
            self.shot(bulletLevel);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // cc.log('touch move');
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('touch end');
        }, this);


    }

    shot(level:number) {
        if (this.bulletPool.size() > 0) {
            this.oneBullet = this.bulletPool.get(this);
        } else {
            this.oneBullet = cc.instantiate(this.bulletPrefab);
        }
        this.oneBullet.getComponent(Bullet).shot(this, level);
    }

    creatFish() {
        if (this.fishPool.size() > 0) {
            this.oneFish = this.fishPool.get(this);
        } else {
            this.oneFish = cc.instantiate(this.fishPrefab);
        }
        this.oneFish.getComponent(Fish).init(this);
    }


    castNet(position:cc.Vec2) {
        if (this.netsPool.size() > 0) {
            this.oneNet = this.netsPool.get(this);
        } else {
            this.oneNet = cc.instantiate(this.netPrefab);
        }
        this.oneNet.getComponent(Net).init(position,this);
    }

    despawnFish(fish: cc.Node) {
        this.fishPool.put(fish);
    }

    despawnBullet(bullet:cc.Node) {
        this.bulletPool.put(bullet);
    }

    despawnNet(net: cc.Node) {
        this.netsPool.put(net);
    }

    gainCoins(coinPos: cc.Vec2, value: number) {
        this.coinController.getComponent(CoinController).gainCoins(coinPos, value);
    }

}
