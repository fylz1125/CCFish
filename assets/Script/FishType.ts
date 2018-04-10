// 定义一个接口，用来对应json配置文件转成对象
interface FishType{
    name: string;
    hp: number;
    gold: number
}

// 鱼的生命状态
enum FishState {
    alive,
    dead
}

export { FishState, FishType };