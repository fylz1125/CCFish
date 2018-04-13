import Coins from './Coins';
import NumUp from './NumUp';
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
    oneCoin: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    init() {
        this.coinUpPool = new cc.NodePool();
        this.coinsPool = new cc.NodePool();
        this.setValue(this.currentValue);
    }

    // 数字固定长度lenght，不够的补0
    prefixInteger(num: number, length: number) {
        return (Array(length).join('0') + num).slice(-length);
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

    // 获取金币加数
    addCoins(value: number) {
        this.currentValue += value;
        this.setValue(this.currentValue);
    }

    // 发射子弹消耗金币
    reduceCoin(level: number): boolean{
        if (this.currentValue >= level) {
            this.setValue(this.currentValue-=level);
            return true;
        } 
        
        return false;
    }

    gainCoins(coinPos: cc.Vec2, coinnum: number) {
        // 上升的数字对象池
        if (this.coinUpPool.size() > 0) {
            this.coin_up = this.coinUpPool.get();
        } else {
            this.coin_up = cc.instantiate(this.coinPlusPrefab);
        }

        this.coin_up.getComponent(NumUp).init(coinPos, coinnum, this);

        // 金币对象池
        if (this.coinsPool.size() > 0) {
            this.oneCoin = this.coinsPool.get();
        } else {
            this.oneCoin = cc.instantiate(this.coinsPrefab);
        }        
        this.oneCoin.getComponent(Coins).init(this);
        // 转为世界坐标
        let toPos = this.node.convertToWorldSpaceAR(this.number3.node.position);
        this.oneCoin.getComponent(Coins).goDown(coinPos, toPos);
        this.addCoins(coinnum);
    }

    despawnCoins(coin:cc.Node) {
        this.coinsPool.put(coin);
    }

    despawnCoinup(nup:cc.Node) {
        this.coinUpPool.put(nup);
    }
}
