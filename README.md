# 全景图





## 最终采用:

Three.js 方案

- 优雅降级
- WebGL ->  Canvas
- IOS  8.0以上支持 WebGL
- Android 5.0 以上支持 WebGL
- Android 4.4.4 Canvas FPS: 20~30
- Android 4.4.2 Canvas FPS: 3~9
- 低端 Android 以及 IOS8.0以下 提示:遗憾无法播放




优化:

 - [ ] 优化 camera 增量变化 引发的轻微抖动
 - [ ] 缓动动画

> 在项目完成的初期，对部分安卓机的内存消耗还是过大，为此在完成项目之后继续尝试了一些优化工作，包括 缩减宇宙的尺寸，合并全景贴图，禁用陀螺仪，预加载和懒加载，星球CSS3动画缩减，资源文件深度压缩等工作，但还是无法避免在内存不足的安卓机下存在Crash的风险，为保证项目的稳定上线，退而求其次对安卓机做了兼容版的体验，预期在后续的项目迭代中再优化页面在安卓下的表现，实现全平台的体验统一。




## 调研方案列表


- 720yun.com
    - Android 4.4.2 存在重力感应延迟偏移问题
    - 其余平台机型效果很好
- Three.js + CSS3DRenderer +自带重力感应
    - Android 4.4.2 客户端 重力感应失效
    - 和自带拖拽冲突
- Three.js + CanvasRenderer + orienter.js
    - FPS
        - iPhone
            - 3~6 卡顿
        - Android
            - 4.4.2 贴吧客户端 2~7 卡顿
    - 重力感应
        - iPhone
            - 可以使用  卡顿
        - Android
            - 4.4.2 贴吧客户端  卡顿
- CSS3D :基于淘宝造物节源码提供的开源项目 orienter.js 和 CSS3D引擎
    - FPS
        - iPhone
            - 60左右 十分流畅
        - Android
            - 高版本系统流畅
            - 4.4.2 贴吧客户端 20左右
    - 重力感应
        - iPhone
            - 灵敏
        - Android
            - 高版本灵敏
            - 4.4.2 贴吧客户端 存在获取重力感应不准的问题
    - 拖拽
        - 实现方案较为繁琐


## 使用的项目

- [制作 Three.js 使用的全景图](https://github.com/budblack/Panoramic)

