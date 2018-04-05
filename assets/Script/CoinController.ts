const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinController extends cc.Component {

    @property(cc.Prefab)
    coinPlusPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    coinsPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    number1: cc.Sprite = null;

    @property(cc.Sprite)
    number2: cc.Sprite = null;

    @property(cc.Sprite)
    number3: cc.Sprite = null;

    @property(cc.Sprite)
    number4: cc.Sprite = null;

    @property(cc.Sprite)
    number5: cc.Sprite = null;

    @property(cc.Sprite)
    number6: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    timerAtlas: cc.SpriteAtlas = null;

    @property
    currentValue: number = 0;

    @property
    toValue: number = 0;

    coinUpPool: cc.NodePool;
    coinsPool: cc.NodePool;

    // +金币数字
    coin_up: cc.Node;

    // 获得金币
    coins: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    init() {
        this.coinUpPool = new cc.NodePool();
        this.coinsPool = new cc.NodePool();

        //初始化金币对象池
        // let initCoins = 5;
        // for(let i=0;i<initCoins;++i){
        //     let tmp = cc.instantiate(this.coinsPrefab);
        //     this.coinsPool.put(tmp);
        // }

    }

    // 数字固定长度lenght，不够的补0
    prefixInteger(num: number, length: number) {
        return (Array(length).join('0') + num).slice(-length);
    }

    moveOne() {
        let num = cc.random0To1() * 1000000;
        this.setValue(num);

    }

    setValue(value: number) {
        let str = this.prefixInteger(value, 6);
        let nums = str.split('');
        this.number1.spriteFrame = this.timerAtlas.getSpriteFrame(nums[0].toString());
        this.number2.spriteFrame = this.timerAtlas.getSpriteFrame(nums[1].toString());
        this.number3.spriteFrame = this.timerAtlas.getSpriteFrame(nums[2].toString());
        this.number4.spriteFrame = this.timerAtlas.getSpriteFrame(nums[3].toString());
        this.number5.spriteFrame = this.timerAtlas.getSpriteFrame(nums[4].toString());
        this.number6.spriteFrame = this.timerAtlas.getSpriteFrame(nums[5].toString());
    }

    addCoins(value: number) {
        this.currentValue += value;
        this.setValue(this.currentValue);
    }

    gainCoins(coinPos: cc.Vec2, coinnum: number) {
        // 上升的数字对象池
        if (this.coinUpPool.size() > 0) {
            this.coin_up = this.coinUpPool.get();
        } else {
            this.coin_up = cc.instantiate(this.coinPlusPrefab);
        }
        // 金币对象池
        if (this.coinsPool.size() > 0) {
            this.coins = this.coinsPool.get();
        } else {
            this.coins = cc.instantiate(this.coinsPrefab);
        }
        // 添加数字节点
        this.coin_up.parent = cc.director.getScene();
        this.coin_up.position = coinPos;
        // 播放数字上升的动画
        let upState = this.coin_up.getComponent(cc.Animation).play('coin_up');
        // 回收金币节点
        upState.on('stop', this.despawnCoinup, this);

        // 添加金币动画节点
        this.coins.parent = cc.director.getScene();
        this.coins.position = coinPos;
        let downState = this.coins.getComponent(cc.Animation).play('gold_down');
        let toPos = this.node.convertToWorldSpaceAR(this.number3.node.position);
        let spawn = cc.spawn(cc.moveTo(0.8, toPos), cc.scaleTo(0.8, 0.5));
        let cb = cc.callFunc(this.despawnCoins, this, coinnum);
        let acf = cc.sequence(spawn, cb);
        this.coins.runAction(acf);
    }

    despawnCoins(target:any,coinnum:number) {
        this.coins.stopAllActions();
        this.coinsPool.put(this.coins);
        // 更新金币
        this.addCoins(coinnum);
    }

    despawnCoinup() {
        this.coinUpPool.put(this.coin_up);
    }


    start() {

    }

}
