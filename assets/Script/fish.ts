import { FishState, FishType } from './FishType';
import Game from './Game';
const { ccclass, property } = cc._decorator;



@ccclass
export default class Fish extends cc.Component {

    // animation 这个属性声明类型，为了在编辑器面板显示类型
    @property(cc.Animation)
    anim: cc.Animation = null;//显示申明类型，才能有代码提示

    // Health point 血量 默认100
    @property
    hp: number = 100;

    // defence 防御值，默认未0
    @property
    defence: number = 0;

    // 鱼游动的速度，先搞个简单的
    @property
    velocity: number = 30;

    @property(cc.SpriteAtlas)
    fishAtlas: cc.SpriteAtlas = null;

    // fish state 鱼的生命状态，默认都是活的
    fishState: FishState = FishState.alive;

    // 保存上一次坐标,用于更新角度
    lastPosition: cc.Vec2;

    //暂存game实例
    game: Game;

    init(game: Game) {
        this.game = game;
        this.enabled = true;
        this.spawnFish(game);
    }

    // spawnFish(fishType:FishType) {
    spawnFish(game: Game) {
        let fishStr = game.fishTypes.length;
        let randomFish = Math.floor(cc.random0To1() * fishStr);
        // cc.log('random :' + randomFish);
        let fishType = game.fishTypes[randomFish];
        this.node.position = cc.p(cc.random0To1() * 100, 700);
        // 贝塞尔曲线第一个控制点，用来计算初始角度
        let firstp = cc.p(100, -200);
        let k = Math.atan((firstp.y) / (firstp.x));
        this.node.rotation = -k * 180 / 3.14;
        this.node.getComponent(cc.Sprite).spriteFrame = this.fishAtlas.getSpriteFrame(fishType.name + '_run_0');
        this.anim.play(fishType.name + '_run');
        this.node.parent = cc.director.getScene();
        this.lastPosition = this.node.getPosition();
        this.changeCollider();
        this.swimming();
    }

    changeCollider() {
        let collider = this.node.getComponent(cc.BoxCollider);
        collider.size = this.node.getContentSize();
    }

    // 小鱼游泳，贝塞尔曲线实现
    swimming() {
        let windowSize = cc.director.getWinSize();
        var bezier = [cc.p(100, -200), cc.p(400, -500), cc.p(1500, -600)];
        let bezerby = cc.bezierBy(20, bezier);
        this.node.runAction(bezerby);
    }

    castNet() {
        this.anim.playAdditive('net_cast_1');
    }

    onLoad() {
    }

    update(dt) {
        this.updateDegree();
    }

    // 更新鱼的角度
    updateDegree() {
        let currentPos = this.node.getPosition();
        // 如果位移不超过1，不改变角度
        if (cc.pDistance(this.lastPosition, currentPos) < 1) {
            return;
        }

        // 计算角度
        let degree;
        if (currentPos.x - this.lastPosition.x == 0) {
            // 垂直
            if (currentPos.y - this.lastPosition.y > 0) {
                degree = -90;
            } else {
                degree = 90;
            }
        } else {
            degree = - Math.atan((currentPos.y - this.lastPosition.y) / (currentPos.x - this.lastPosition.x)) * 180 / 3.14;
        }
        this.node.rotation = degree;
        this.lastPosition = currentPos;
        this.despawnFish();
    }

    despawnFish() {
        if (this.die()) {
            this.game.despawnFish(this.node);
        } else {
            if (this.node.x > 1300
                || this.node.x < -100
                || this.node.y > 900
                || this.node.y < 0
            ) {
                // this.node.removeFromParent();
                // 可以不移除节点，停止所有动作也可以完成
                this.node.stopAllActions();
                this.game.despawnFish(this.node);
            }
        }
    }

    // 碰撞检测，鱼被打死的逻辑
    die(): boolean {
        return false;
    }

    onCollisionEnter(othe, self) {
    }
}
