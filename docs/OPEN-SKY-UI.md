# Open Sky 界面

2026-11-03，用户明确选择苹果风格的按钮、导航与面板，保留蓝天白云、夜间粒子星空背景；“去掉 AI 味”指移除模板化视觉，保留原位引导与总结功能。本次由本机源码实现，没有接入 Canva 或在线图片服务。

`local/cupertino.css` 是正式本地入口的最后一个样式层；`public/knowledge-universe/cupertino.css` 负责知识宇宙的工具栏、阅读器与文件管理。前者不改变记录、AI、邮箱或资料版本逻辑。外观的 `island` / `observatory` 标识保持兼容，切换只改变主题属性，保留当前输入。

2026-11-04，用户明确要求所有模块采用可调的半透明磨砂，替代前一版“只有导航和工具磨砂、正文近乎不透明”的材质约束。导航、模块面板、知识阅读器与资料弹窗共享玻璃设置；文字保持完全不透明，原生输入框保留自身填色。蓝色标识主要操作，灰色按钮表示次要操作，红色保留给删除等操作；悬停、按压、停用、焦点及选中状态继续可见。连续记录、独立填写区、成长主题索引和知识深空画布保持原有几何。

在「偏好设置 → 外观与动态 → 玻璃质感」调整透明度（0–65%，默认 36%）和磨砂强度（0–40px，默认 20px）。原生滑块支持键盘并显示当前值，调整即时预览且自动保存到本机；「恢复默认」只重置这两项，保留皮肤和动态选择。旧的 appearance version 2 与存储键继续兼容。面板实际颜色使用 `rgb(var(--panel-rgb) / var(--panel-opacity))`：深色 RGB 为 32/38/54，亮色为 250/253/255，默认 alpha .64，随透明度变化；不是固定的旧白色或灰色 alpha。跨窗口和知识 iframe 更新保留输入、笔记及三维图谱实例。

系统启用「减少透明效果」时，显示实心面板、停止模糊，仍保存你的玻璃选择并说明原因。不支持背景模糊的浏览器采用近实心回退（源码 alpha .97），包括五个基本环境按钮；悬停文字和选中填色仍有区别。减少动态、输入和后台暂停规则继续生效。

成长页新增始终可见的五个「基本环境」入口：个人、家庭、周围社会、地区文化（民间与政府）、国家与国际。首次点击打开未保存表单，只有明确保存才创建可改名的“我的基本环境”主题；已有主题仍编辑自己的环境历史。表单内切换层次保留输入。地区区分民间生活与文化、政府与公共治理；国家政策输入保留适用时间、来源与个人观察，不内置现实政策判断。

设计参考为 Apple 的 [Materials](https://developer.apple.com/design/human-interface-guidelines/materials)、[Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) 和 [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)。这些是设计原则参考；未复制苹果图标、商标、SF 字体或 SF Symbols，不声明这是原生 macOS 或完整 Liquid Glass 实现。中文与界面字体由系统提供，LifeAtlas 字标沿用已有开源 Alegreya 矢量轮廓。

用户最初要求查找可复用的 GitHub 项目，因此查阅 [Tabler](https://github.com/tabler/tabler)，仅改编按钮 `inline-flex` 对齐、内容排列的基础代码。实际视觉以用户后续指定的苹果风格为准，没有引入整套 Bootstrap 或改写为 React。

| 上游文件 | 固定 Git blob SHA | 本项目副本 |
| --- | --- | --- |
| `core/scss/ui/_buttons.scss` 前 60 行 | `050b94eabbbb8d5b13d20ebf6b598178a886a894` | `public/vendor/tabler/buttons-source-excerpt.scss.txt` |
| `LICENSE` | `aa69649cde83c2d6517ec2498a9c10f5bb3bf54c` | `public/vendor/tabler/LICENSE` |

上述文件通过已连接的 GitHub 工具读取，查询分支为 `dev`，记录于 2026-11-03。保留 Tabler Authors 的完整 MIT 许可，随 Windows 包的 `web/vendor/tabler` 一起发布。源码片段只作来源记录，不作为未完成的 SCSS 编译。

新图标是原创 SVG 几何“极光星云”，由本机 Sharp/Pillow 生成 PNG 和十尺寸 ICO，详情见 [APP-ICON.md](APP-ICON.md)。不调用付费模型或云渲染；验证只使用隔离样例和本机模拟接口，不访问真实邮箱或模型服务。
