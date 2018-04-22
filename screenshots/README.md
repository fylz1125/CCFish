# 通用弹出对话框
### 最近比较关注creator，写了一些东西，自己搭了一个论坛，有兴趣的朋友可以关注一下。

### 开发工具：
- cocoscreator v1.8.1
- 脚本：Typescript
- 代码编辑器：vscode1.20.1

### Q讨论群（大游戏）：704391772
### 扫二维码进群：
![qq](screenshots/qqgroup.JPG)
### 论坛：http://bigame.feofox.com/

素材网上找的，原作者看到的话不要介意。
### 介绍一下弹出对话框的设计思路
1. 制作一个弹出框的预制Alert.prefab，包括半透明背景层，对话框，确定按钮，取消按钮，标题文字
2. 弹出框绑定一个脚本组件Alert.ts，脚本实现界面初始化，弹出弹入动画，确定按钮回调函数，对外暴露showAlert方法

有几个坑要讲一下：
1. 对话框要屏蔽底层点击事件，也就是说对话框弹出来之后被它遮住的层不能再响应点击事件，给遮盖层添加一个Block input events组件就搞定了。
2. 确定和取消按钮采用了widget组件来做相对布局之后，后面如果要动态修改按钮位置，需要找到这个widget，修改位置之后要强制刷新一下，否则会在下一帧生效。

更详细的看代码吧，有问题可以加群讨论。
![alert2](screenshots/alert2.png)

# 如果对你有帮助，请打赏一下
<div align="center">
<img src="screenshots/alipay2.jpg">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="screenshots/wechatpay2.jpg">
</div>


