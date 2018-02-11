import SuperClass from "./SuperClass";
const {ccclass} = cc._decorator;

@ccclass
export default class ChildClass extends SuperClass {
    protected async testAsync(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve("Hello, World! From ChildClass!");
            }, 1000);
        });
    }
}
