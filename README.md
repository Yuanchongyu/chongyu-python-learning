# Python Craft Lab

一个面向 Python 初学者的 Minecraft 风格互动编程练习网页。

学生在 Monaco（VS Code 同款编辑器核心）中编写真正的 Python 代码，控制 3D 方块世界里的角色移动、转弯、判断障碍并建造方块。Python 通过 Pyodide 在浏览器内运行，不需要安装本地环境。

3D 场景由 Three.js 渲染，支持光照、阴影、角色动画和鼠标拖动视角。

## 当前关卡

1. 函数调用
2. `for` 循环
3. 变量
4. 转弯与顺序执行
5. `if` 条件判断
6. 自定义函数

## 本地运行

直接打开 `index.html`，或在项目目录运行：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 部署

这是一个纯静态网页，可以直接导入 Vercel，无需设置构建命令或环境变量。

## 说明

本项目是独立制作的编程教育练习，不隶属于 Mojang Studios 或 Microsoft。
