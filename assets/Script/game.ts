import { FishState, FishType } from './FishType';
import Fish from './Fish';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    fishPool: cc.NodePool;
    fishTypes: FishType[];

    @property(cc.Prefab)
    fishPrefab: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // let fish = cc.instantiate(this.fishPrefab);
        // fish.setPosition(cc.p(100, 100));
        // this.node.addChild(fish);
        let cnode: cc.Node = this.node;
        this.fishPool = new cc.NodePool(Fish);
        let self = this;

        // 动态加载json配置文件
        cc.loader.loadRes("fishconfig", function (err, data) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // 加载之后转类型
            self.fishTypes = <FishType[]>data;
           self.initFish();
        });

    }

    initFish() {
        var self = this;
        if (this.fishTypes.length > 0) {
            this.fishTypes.forEach(value => {
                let fish = cc.instantiate(self.fishPrefab);
                let runstring = value.name + '_run';
                cc.log('... ' + runstring);
                let fish_x = cc.randomMinus1To1() * self.node.width / 2;
                let fish_y = cc.randomMinus1To1() * self.node.height / 2;
                fish.setPosition(fish_x, fish_y);
                fish.getComponent(Fish).run(value.name + '_run');
                self.node.addChild(fish);
            });
        }
    }

    start() {

    }

    // update (dt) {},
}
