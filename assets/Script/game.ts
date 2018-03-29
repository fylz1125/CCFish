import { FishState, FishType } from './FishType';
import Fish from './Fish';
import Bullet from './Bullet';
import Net from './Net';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
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

    oneFish: cc.Node;
    oneBullet: cc.Node;
    oneNet: cc.Node;

    //子弹对象池
    bulletPool: cc.NodePool;
    netsPool: cc.NodePool;

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.bulletPool = new cc.NodePool(Bullet);
        this.fishPool = new cc.NodePool(Fish);
        this.netsPool = new cc.NodePool();

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
            self.schedule(self.creatFish, 5);
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
            self.shot();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // cc.log('touch move');
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('touch end');
        }, this);


    }

    cannonPlus() {
        let anim = this.weaponNode.getComponent(cc.Animation);
        anim.play('weapon_level1');
    }

    // castNet() {
    //     cc.log('cast net');
    //     this.oneFish.getComponent(Fish).castNet();
    // }

    shot() {
        if (this.bulletPool.size() > 0) {
            this.oneBullet = this.bulletPool.get(this);
        } else {
            this.oneBullet = cc.instantiate(this.bulletPrefab);
        }
        // self.oneBullet = cc.instantiate(this.bulletPrefab);
        // let bulletPos = self.weaponNode.parent.convertToWorldSpaceAR(self.weaponNode.getPosition());
        this.oneBullet.getComponent(Bullet).init(this);
    }

    initFish() {
        var self = this;
        // if (this.fishTypes.length > 0) {
        //     this.fishTypes.forEach(value => {
                // let fish = cc.instantiate(self.fishPrefab);
        //         let runstring = value.name + '_run';
        //         let fish_x = cc.randomMinus1To1() * self.node.width / 2;
        //         let fish_y = cc.randomMinus1To1() * self.node.height / 2;
        //         fish.setPosition(fish_x, fish_y);
        //         self.node.addChild(fish);
                // fish.getComponent(Fish).initFish(value.name + '_run');

        //     });
        // }
        // let fish = cc.instantiate(self.fishPrefab);
        // fish.getComponent(Fish).initFish();


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
        cc.log('game despawn');
        this.netsPool.put(net);
    }

    // update (dt) {},
}