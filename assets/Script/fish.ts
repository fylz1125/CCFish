import { FishState, FishType } from './FishType';
const { ccclass, property } = cc._decorator;



@ccclass
export default class Fish extends cc.Component {

    // animation
    @property(cc.Animation)
    anim = null;

    // Health point 血量 默认100
    @property
    hp: number = 100;

    // defence 防御值，默认未0
    @property
    defence: number = 0;

    // 鱼游动的速度，先搞个简单的
    @property
    velocity: number = 30;

    // fish state 鱼的生命状态，默认都是活的
    fishState: FishState = FishState.alive;

    // 保存上一次坐标,用于更新角度
    lastPosition: cc.Vec2;

    initFish() {
        this.node.position = cc.p(cc.random0To1() * 100, 600);
        let firstp = cc.p(100, -600);
        let k = Math.atan((firstp.y - this.node.y) / (firstp.x - this.node.x));
        this.node.rotation = -k * 180 / 3.1415926;
        cc.log('init rotation ' + this.node.rotation);
        this.anim.play('fish_red.run');
        this.node.parent = cc.director.getScene();
        this.lastPosition = this.node.getPosition();
        this.swimming();
    }

    // 小鱼游泳，贝塞尔曲线实现
    swimming() {
        let windowSize = cc.director.getWinSize();
        var bezier = [cc.p(100, -600), cc.p(700, -100), cc.p(500, 900)];
        let bezerby = cc.bezierBy(8, bezier);
        this.node.runAction(bezerby);
    }

    onLoad() {
    }

    die() {
    }

    update(dt) {
        this.updateDegree();
    }

    // 更新鱼的角度
    updateDegree() {
        let currentPos = this.node.getPosition();
        // 动画结束之后位置不变
        if (currentPos.equals(this.lastPosition)) {
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
            degree = - Math.atan((currentPos.y - this.lastPosition.y) / (currentPos.x - this.lastPosition.x)) * 180 / 3.1415926;
        }
        this.node.rotation = degree;
        this.lastPosition = currentPos;
    }

}
