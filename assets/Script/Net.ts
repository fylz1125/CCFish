import Game from './Game';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Net extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    game: Game;
    
    curLevel: number = 1;

    init(position: cc.Vec2, game: Game, level: number) {
        this.curLevel = level;
        this.node.parent = cc.director.getScene();
        this.node.position = position;
        this.game = game;
        this.anim.play('net_'+this.curLevel);
    }

    despawnNet() {
        this.game.despawnNet(this.node);
    }

}
