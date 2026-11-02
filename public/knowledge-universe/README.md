# LifeAtlas 知识宇宙模块

这是融合版的自包含知识运行资源，由主应用的 `src/knowledge.ts` 挂载。完整融合说明见仓库根目录 `docs/KNOWLEDGE-UNIVERSE.md`；日常使用建议从主应用 `#knowledge` 进入。

## 独立复用

保留整个目录，可直接打开index.html或放在静态HTTP服务下。字体、Three.js、轨道控制、数据和代码生成的星空均在本地，无需CDN或付费API。`?embedded=1`供同源LifeAtlas嵌入，隐藏重复品牌/侧栏，并通过经过来源校验的消息报告输入状态；独立使用不要加这个参数。

六个独立领域：股市、心理学、哲学、天文学、数学、物理。包含113个节点、112条包含关系、106条语义关系、8条学习路线，最深5层。左键旋转、滚轮缩放、点击框架逐层进入，顶部路径返回，跨系入口跳转。

收藏、已读、自建框架、笔记保存在当前浏览器，建议导出JSON。不同地址和浏览器不共享记录；旧file://版可导出后在融合版导入，支持V1/V2备份。父级用parent表示，循环层级被拒绝，删除自建框架会把下级移到上一层。

`knowledge.json`是起始数据，编辑后运行 `node sync-data.cjs`校验并同步knowledge.js；无需重建Three.js。新增领域应在domains中定义，并添加父级为universe的根节点。运行时和源码边界、许可见THIRD_PARTY_NOTICES.md与vendor目录。

星球大小、表面与轨道是知识结构示意，不是天文比例模拟。外部参考链接需要联网；金融内容不接实时行情或自动产生投资信号。原知识代码和摘要为MIT，Three.js为MIT，SpaceGrotesk字体为OFL。
