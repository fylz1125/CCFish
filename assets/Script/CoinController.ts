const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinController extends cc.Component {

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

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

    coinsPool: cc.NodePool;

    coin: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    init() {
        this.coinsPool = new cc.NodePool();
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
        this.toValue = value;
        let str = this.prefixInteger(value, 6);
        let nums = str.split('');
        this.number1.spriteFrame = this.timerAtlas.getSpriteFrame(nums[0].toString());
        this.number2.spriteFrame = this.timerAtlas.getSpriteFrame(nums[1].toString());
        this.number3.spriteFrame = this.timerAtlas.getSpriteFrame(nums[2].toString());
        this.number4.spriteFrame = this.timerAtlas.getSpriteFrame(nums[3].toString());
        this.number5.spriteFrame = this.timerAtlas.getSpriteFrame(nums[4].toString());
        this.number6.spriteFrame = this.timerAtlas.getSpriteFrame(nums[5].toString());
    }

    gainCoins(coinPos: cc.Vec2, value: number) {
        if (this.coinsPool.size() > 0) {
            this.coin = this.coinsPool.get(this);
        } else {
            this.coin = cc.instantiate(this.coinPrefab);
        }
        this.coin.parent = cc.director.getScene();
        this.coin.position = coinPos;
        let aniState = this.coin.getComponent(cc.Animation).play('coin_up');
        // 回收金币节点
        aniState.on('stop', this.despawnCoin, this);
    }

    despawnCoin() {
        this.coinsPool.put(this.coin);
    }

    start() {

    }

}
