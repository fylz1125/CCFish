import CoinController from './CoinController'
const { ccclass, property } = cc._decorator;

@ccclass
export default class Coins extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    cointroller: CoinController;


    init(ctr: CoinController) {
        this.cointroller = ctr;
        this.anim.play('gold_down');
    }

    goDown(pos: cc.Vec2, toPos?: cc.Vec2) {
        this.node.parent = cc.director.getScene()
        this.node.position = pos;
        let spawn = cc.spawn(cc.moveTo(0.8, toPos), cc.scaleTo(0.8, 0.5));
        let cb = cc.callFunc(this.despawnCoin, this);
        let acf = cc.sequence(spawn, cb);
        this.node.runAction(acf);
    }
    
    despawnCoin() {
        this.cointroller.despawnCoins(this.node);
    }

}
