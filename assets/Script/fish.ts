// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

enum FishState {
    alive,
    dead
}

@ccclass
export default class NewClass extends cc.Component {

    // animation
    @property(cc.Animation)
    anim = null;

    // Health point 血量 默认100
    @property
    HP:number = 100;

    // defence 防御值，默认未0
    @property
    defence:number = 0;

    // fish state 鱼的生命状态，默认都是活的
    fishState:FishState = FishState.alive;


    // LIFE-CYCLE CALLBACKS:
    // start () {
    // }

    initFish (fish:any) {
    }


    onLoad () {
        this.anim.play('fish_red_run');
        
    }

    die () {
        // this.anim.play('fish_red_die');
    }
    // update (dt) {},
}
