/*
 * @Author: your name
 * @Date: 2019-12-18 22:20:56
 * @LastEditTime: 2020-02-17 18:34:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \CourseFishd:\cocos20\CCFish\assets\Script\Bullet.ts
 */
import Game from './Game';
const { ccclass, property } = cc._decorator;

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
        this.angle = -game.weaponNode.angle;
        this.node.angle = -this.angle;
        let bpos = cc.v2(weaponSite.x + 50 * Math.sin(this.angle / 180 * 3.14), weaponSite.y + 50 * Math.cos(this.angle / 180 * 3.14));
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

        if (this.node.x > cc.winSize.width + 100
            || this.node.x < -100
            || this.node.y > cc.winSize.height + 100
            || this.node.y < 0
        ) {
            this.game.despawnBullet(this.node);
        }
    }
    onCollisionEnter(other, self) {
        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        let posb = self.world.points;
        // 取左上和右上坐标计算中点当做碰撞中点
        let posNet = posb[0].add(posb[3]).mul(0.5);
        this.game.castNet(posNet);
        this.game.despawnBullet(this.node);
    }

    getAttackValue(): number {
        return this.attack * this.bulletLeve;
    }
}
