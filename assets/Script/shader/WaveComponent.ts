/*
 * @Author: your name
 * @Date: 2020-02-14 20:08:57
 * @LastEditTime : 2020-02-14 23:11:23
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \CourseFishd:\cocos20\CCFish\assets\Script\shader\WaveComponent.ts
 */
const {
    ccclass,
    property,
    executeInEditMode,
    requireComponent
} = cc._decorator;

@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
export default class Wave extends cc.Component {
    private _time = 0;
    private material: cc.Material;

    // onLoad () {}

    start() {
        cc.dynamicAtlasManager.enabled = false;
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
        this.setResolution();
    }

    update(dt) {
        this._time += dt;
        this.material.setProperty("time", this._time);
    }

    private setResolution() {
        this.material.setProperty(
            "resolution",
            cc.v2(this.node.width, this.node.height)
        );
    }
}
