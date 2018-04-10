import CoinController from './CoinController'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NumUp extends cc.Component {


    @property(cc.Animation)
    anim: cc.Animation = null;

    @property(cc.SpriteAtlas)
    numAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    tensPlace: cc.Sprite = null;

    @property(cc.Sprite)
    onesPlace: cc.Sprite = null;

    cointroller: CoinController;

    init(pos: cc.Vec2, num: number, ctr: CoinController) {
        this.cointroller = ctr;
        let str = num.toString();
        let nums = str.split('');
        if (nums.length == 1) {
            this.onesPlace.node.active = false;
            this.tensPlace.spriteFrame = this.numAtlas.getSpriteFrame('goldnum_' + nums[0]);
        } else {
            this.onesPlace.node.active = true;
            this.tensPlace.spriteFrame = this.numAtlas.getSpriteFrame('goldnum_' + nums[0]);
            this.onesPlace.spriteFrame = this.numAtlas.getSpriteFrame('goldnum_' + nums[1]);
        }
        this.node.parent = cc.director.getScene();
        this.node.position = pos;
        let upState = this.anim.play('coin_up');
        upState.on('stop', this.despawn, this);

    }
    
    despawn() {
        this.cointroller.despawnCoinup(this.node);
    }
}
