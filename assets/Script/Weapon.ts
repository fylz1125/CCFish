const { ccclass, property } = cc._decorator;

@ccclass
export default class Weapon extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    curLevel: number;
    total: number;
    
    init() {
        this.curLevel = 1;
        this.total = this.anim.getClips().length;
    }

    plus() {
        if (this.curLevel + 1 > this.total) {
            this.curLevel = this.total;
        } else {
            this.curLevel++;
        }
        this.anim.play('weapon_level_' + this.curLevel);
    }

    reduce() {
        if (this.curLevel < 2) {
            this.curLevel = 1;
        } else {
            this.curLevel--;
        }
        this.anim.play('weapon_level_' + this.curLevel);
    }
    

}
