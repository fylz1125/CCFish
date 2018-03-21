const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Node)
    // number_1: cc.Node = null;

    // @property(cc.Sprite)
    // number_2: cc.Sprite = null;
    
    // @property(cc.Sprite)
    // number_3: cc.Sprite = null;

    // @property(cc.Sprite)
    // number_4: cc.Sprite = null;

    // @property(cc.Sprite)
    // number_5: cc.Sprite = null;

    // @property(cc.Sprite)
    // number_6: cc.Sprite = null;

    @property
    speed: number = 0;
    
    @property
    resetY: number = 0;    
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let mask = this.node.getComponent(cc.Mask);
        // this.number_10.y = 129;
    }

    start () {

    }

    update(dt) {
        let ny = this.node.y;
        ny += this.speed * dt;
        if (ny <= this.resetY) {
            ny = 119;
        }
        this.node.y = ny;
    }


}
