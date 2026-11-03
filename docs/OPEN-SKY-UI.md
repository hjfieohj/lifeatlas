# Open Sky 界面

2026-11-03，用户明确选择苹果风格的按钮、导航与面板，保留蓝天白云、夜间粒子星空背景；“去掉 AI 味”指移除模板化视觉，保留原位引导与总结功能。本次由本机源码实现，没有接入 Canva 或在线图片服务。

`local/cupertino.css` 是正式本地入口的最后一个样式层；`public/knowledge-universe/cupertino.css` 负责知识宇宙的工具栏、阅读器与文件管理。前者不改变记录、AI、邮箱或资料版本逻辑。外观的 `island` / `observatory` 标识保持兼容，切换只改变主题属性，保留当前输入。

导航和工具栏使用适量半透明与背景模糊；正文、表单使用稳定的白色或炭灰阅读面。蓝色标识主要操作，灰色按钮表示次要操作，红色保留给删除等操作；提供悬停、按压、停用、键盘焦点和减少动态状态。记录列表使用连续分隔的内容，填写区独立；成长保持主题索引与时间线，知识三维画布保持深空。

设计参考为 Apple 的 [Materials](https://developer.apple.com/design/human-interface-guidelines/materials)、[Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) 和 [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)。这些是设计原则参考；未复制苹果图标、商标、SF 字体或 SF Symbols，不声明这是原生 macOS 或完整 Liquid Glass 实现。中文与界面字体由系统提供，LifeAtlas 字标沿用已有开源 Alegreya 矢量轮廓。

用户最初要求查找可复用的 GitHub 项目，因此查阅 [Tabler](https://github.com/tabler/tabler)，仅改编按钮 `inline-flex` 对齐、内容排列的基础代码。实际视觉以用户后续指定的苹果风格为准，没有引入整套 Bootstrap 或改写为 React。

| 上游文件 | 固定 Git blob SHA | 本项目副本 |
| --- | --- | --- |
| `core/scss/ui/_buttons.scss` 前 60 行 | `050b94eabbbb8d5b13d20ebf6b598178a886a894` | `public/vendor/tabler/buttons-source-excerpt.scss.txt` |
| `LICENSE` | `aa69649cde83c2d6517ec2498a9c10f5bb3bf54c` | `public/vendor/tabler/LICENSE` |

上述文件通过已连接的 GitHub 工具读取，查询分支为 `dev`，记录于 2026-11-03。保留 Tabler Authors 的完整 MIT 许可，随 Windows 包的 `web/vendor/tabler` 一起发布。源码片段只作来源记录，不作为未完成的 SCSS 编译。

新图标是原创 SVG 几何“极光星云”，由本机 Sharp/Pillow 生成 PNG 和十尺寸 ICO，详情见 [APP-ICON.md](APP-ICON.md)。不调用付费模型或云渲染；验证只使用隔离样例和本机模拟接口，不访问真实邮箱或模型服务。
