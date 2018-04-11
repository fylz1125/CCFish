import Game from './Game';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    // 子弹初始角度
    angle: number = 0;

    game: Game;

    // 子弹攻击力，基础攻击力
    private attack: number = 4;

    // 子弹速度
    @property
    speed: number = 10;  

    bulletLeve: number = 1;

    shot(game: Game, level: number) {
        this.game = game;
        // 启动update函数
        this.enabled = true;
        let weaponSite = game.weaponNode.parent.convertToWorldSpaceAR(game.weaponNode.getPosition());
        this.angle = game.weaponNode.rotation;
        this.node.rotation = this.angle;
        let bpos = cc.p(weaponSite.x + 50 * Math.sin(this.angle / 180 * 3.14), weaponSite.y + 50 * Math.cos(this.angle / 180 * 3.14));
        this.setBullet(level);
        this.node.position = bpos;
        this.node.parent = cc.director.getScene();
    }

    // 根据武器等级设置子弹等级
    setBullet(level: number) {
        this.bulletLeve = level;
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.spAtlas.getSpriteFrame('bullet' + this.bulletLeve);
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
        }
    }
    onCollisionEnter(other, self) {
        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        let posb = self.world.points;
        // 取左上和右上坐标计算中点当做碰撞中点
        let posNet = cc.pMidpoint(posb[0], posb[3]);
        this.game.castNet(posNet);
        this.game.despawnBullet(this.node);
    }

    getAttackValue():number {
        return this.attack * this.bulletLeve;
    }
}
