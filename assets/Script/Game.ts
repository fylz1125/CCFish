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
    
    @property(cc.SpriteAtlas)
    spAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    gameOverNode: cc.Node = null;

    @property({
        type:cc.AudioClip
    })
    bgm: cc.AudioClip = null;    
    

    oneFish: cc.Node;
    oneBullet: cc.Node;
    oneNet: cc.Node;

    //子弹对象池
    bulletPool: cc.NodePool;
    netsPool: cc.NodePool;

    onLoad() {
        cc.audioEngine.playMusic(this.bgm, true);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.bulletPool = new cc.NodePool(Bullet);
        this.fishPool = new cc.NodePool(Fish);
        // 池子里面多放几条鱼
        let initCount = 10;
        for (let i = 0; i < initCount; ++i){
            let fishPre = cc.instantiate(this.fishPrefab);
            this.fishPool.put(fishPre);
        }
        this.netsPool = new cc.NodePool();

        this.coinController.getComponent(CoinController).init();
        this.weaponNode.getComponent(Weapon).init();
        // 设置zorder，控制显示层级
        // 背景在最下层，最上层是炮台
        // 中间层是鱼
        cc.find('Canvas/gameBg').zIndex = -1;
        cc.find('Canvas/bottomBar').zIndex = 1;
        this.gameOverNode.zIndex = 2;
        this.gameOverNode.active = false;

        let self = this;
        cc.debug.setDisplayStats(true);
        // 动态加载json配置文件
        cc.loader.loadRes("fishconfig", function (err, jsonAsset) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // 加载之后转类型
            self.fishTypes = <FishType[]>jsonAsset.json;
            self.schedule(self.creatFish, 2);
        });



        // 添加触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) { 
            // 触点是世界坐标，需要转换为和炮台一致的坐标系下
            let touchPos = self.weaponNode.parent.convertToNodeSpaceAR(event.getLocation());
            // 炮台坐标
            let weaponPos = self.weaponNode.getPosition();
            // 炮台到触点的方向向量
            let dir = touchPos.sub(weaponPos);
            // 计算夹角，这个夹角是带方向的
            let angle = dir.signAngle(cc.v2(0, 1));
            //将弧度转换为欧拉角
            let degree = angle / Math.PI * 180;
            // 设置炮台角度
            self.weaponNode.angle = -degree;
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
        // 剩余金币
        let left = this.coinController.getComponent(CoinController).reduceCoin(level);
        if (left) {
            this.oneBullet.getComponent(Bullet).shot(this, level);
        } else {
            if (this.coinController.getComponent(CoinController).currentValue == 0) {
                this.gameOver();
            }
        }
        
    }

    creatFish() {
        /**
        if (this.fishPool.size() > 0) {
            this.oneFish = this.fishPool.get(this);
        } else {
            this.oneFish = cc.instantiate(this.fishPrefab);
        }
        this.oneFish.getComponent(Fish).init(this);
        */
       //一次创建3条鱼
        
        let fishCount = 3;
        for (let i = 0; i < fishCount; ++i){
            let cfish: cc.Node = null; 
            if (this.fishPool.size() > 0) {
                cfish = this.fishPool.get(this);
            } else {
                cfish = cc.instantiate(this.fishPrefab); 
            }
           cfish.getComponent(Fish).init(this);
        }
         
        
    }


    castNet(position:cc.Vec2) {
        if (this.netsPool.size() > 0) {
            this.oneNet = this.netsPool.get(this);
        } else {
            this.oneNet = cc.instantiate(this.netPrefab);
        }
        let bulletLevel = this.weaponNode.getComponent(Weapon).curLevel;
        this.oneNet.getComponent(Net).init(position,this,bulletLevel);
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

    gameOver() {
        this.gameOverNode.active = true;
        this.unscheduleAllCallbacks();
    }

    gameRestart() {
        // cc.game.restart();
        cc.director.loadScene('mainscene');
    }
}
