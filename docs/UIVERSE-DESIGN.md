# LifeAtlas × Uiverse：轻柔工具组件

2026-10-31。视频 https://www.douyin.com/video/7681651824293611496 的画面明确出现 uiverse-io/galaxy；已检查视频抽帧，未把标题关键词猜测当作确认。上游 https://github.com/uiverse-io/galaxy ，MIT，核对提交 adbd2adde0a299a3956ea288fb444ec01891ca41。

## 实际采用

- 主按钮：`Buttons/0x-Sarthak_hungry-penguin-30.html`。保留圆形铺开的悬停底层和箭头位移，适配项目原按钮结构、12px圆角、两套语义配色、180–240ms反馈、禁用与减少动态。
- 开关：`Toggle-switches/AbanoubMagdy1_fluffy-octopus-90.html`。保留轨道、活动滑块及兄弟选择器状态机制，适配粒子开关和偏好开关，取消翻面，保留原生checkbox、完整点击区域和可见键盘焦点。
- 输入框、分段视图、主题选择和双入口工具面板为 LifeAtlas 配套设计；并非声称全部复制自上游。保持五个主模块、两套皮肤、原始数据、功能和粒子渲染。

完整上游授权文本位于 `public/licenses/Uiverse-Galaxy-MIT.txt`，CSS内保留作者注明。未克隆整个组件仓库，未添加 npm 依赖、字体、图片或付费服务。

## 视觉与行为

在已确认的生活阅览室上统一控件，深蓝侧栏与白色阅读页继续保留；12px控件、14px阅读面与工具面板、平面分段选择、简洁轨道开关。色彩沿用两套皮肤的语义变量，主体阅读仍为连续文本。开关保存沿用原逻辑，不替换数据或事件处理。纯展示变化不引入新持久化格式。
