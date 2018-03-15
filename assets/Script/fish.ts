import { FishState, FishType } from './FishType';
const {ccclass, property} = cc._decorator;



@ccclass
export default class Fish extends cc.Component {

    // animation
    @property(cc.Animation)
    anim = null;

    // Health point 血量 默认100
    @property
    hp:number = 100;

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
        // this.anim.play('fish_red_run');

    }
    run (runani:string ) {
        this.anim.play(runani);
    }

    die () {
        // this.anim.play('fish_red_die');
    }
    // update (dt) {},
}
