import Game from './Game';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    // onLoad () {}
    // 子弹初始角度
    angle: number = 0;

    game: Game;

    // 子弹速度
    @property
    speed: number = 10;

    init(game:Game) {
        this.game = game;
        this.enabled = true;
        this.shot(game);
    }

    // shot(ang: number, weaponSite: cc.Vec2) {
    shot(game: Game) {
        let weaponSite = game.weaponNode.parent.convertToWorldSpaceAR(game.weaponNode.getPosition());
        this.angle = game.weaponNode.rotation;
        this.node.rotation = this.angle;
        let bpos = cc.p(weaponSite.x + 50 * Math.sin(this.angle / 180 * 3.14), weaponSite.y + 50 * Math.cos(this.angle / 180 * 3.14));
        this.node.position = bpos;
        this.node.parent = cc.director.getScene();
    }

    update(dt) {
        let bx = this.node.x;
        let by = this.node.y;
        bx += dt * this.speed * Math.sin(this.angle / 180 * 3.14);
        by += dt * this.speed * Math.cos(this.angle / 180 * 3.14);
        this.node.x = bx;
        this.node.y = by;

        if (this.node.x > cc.director.getWinSize().width + 100
            || this.node.x < -100
            || this.node.y > cc.director.getWinSize().height + 100
            || this.node.y < 0
        ) {
            this.game.despawnBullet(this.node);
            // cc.log('bullet x ' + this.node.x);
        }
    }
    onDestroy() {
        cc.log('destroy bullet');
    }
}
