## React语法构建小程序
> 本项目纯属学习之用，目的是为了让大家了解原理，因此功能实现不齐全，切不可以投入到实际业务进行使用！

本项目简单实现了React语法构建小程序的过程，即将src目录的React计数器运行至小程序平台，分别通过两种方式实现：一种是编译时方式实现（代码目录：`packages/compile-core`），另一种是运行时方式实现（代码目录：`packages/runtime-core`）。想要了解更多实现细节可阅读此文章：[https://juejin.cn/post/7042700848559816717](https://juejin.cn/post/7042700848559816717)。

## 如何使用
安装依赖

```
npm install
```

重编译构建（构建成功后用微信开发者工具导入 /dist/compile 目录）

```
npm run build:compile
```


重运行构建（构建成功后用微信开发者工具导入 /dist/runtime 目录）

```
npm run build:runtime
```