import Game from './Game';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Net extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    game: Game;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(position:cc.Vec2,game:Game) {
        this.node.parent = cc.director.getScene();
        this.node.position = position;
        this.game = game;
        this.anim.play('net_1');
    }

    despawnNet() {
        cc.log('net despawn');
        this.game.despawnNet(this.node);
    }

    start () {

    }

    // update (dt) {}
}
