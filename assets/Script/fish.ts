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

    initFish(fishType:FishType) {
        this.node.position = cc.p(cc.random0To1() * 100, 700);
        // 贝塞尔曲线第一个控制点，用来计算初始角度
        let firstp = cc.p(100, -200);
        let k = Math.atan((firstp.y ) / (firstp.x));
        this.node.rotation = -k * 180 / 3.1415926;
        this.anim.play(fishType.name+'_run');
        this.node.parent = cc.director.getScene();
        this.lastPosition = this.node.getPosition();
        this.swimming();
    }

    // 小鱼游泳，贝塞尔曲线实现
    swimming() {
        let windowSize = cc.director.getWinSize();
        var bezier = [cc.p(100, -200), cc.p(400, -500), cc.p(1000, -500)];
        let bezerby = cc.bezierBy(10, bezier);
        this.node.runAction(bezerby);
    }

    castNet() {
        this.anim.play('net_cast_1');
    }

    onLoad() {
        // this.enabled = false;
    }

    die() {
    }

    update(dt) {
        this.updateDegree();
    }

    // 更新鱼的角度
    updateDegree() {
        let currentPos = this.node.getPosition();
        // 如果位移不超过1，不改变角度
        if (cc.pDistance(this.lastPosition, currentPos)<1) {
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
