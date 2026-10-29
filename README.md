# LifeAtlas · 生活全图

首轮交互原型，2026-10-17 启动。第一位使用者为产品发起人本人。

## 当前能体验什么

- 个人成长 / 环境感知：位于“今日”之后。按个人、家庭、身边社会、地域与制度、宏观与外部环境五层整理，关联职业、专业和行业；两个入口支持持续成长与困扰选择。当前为规则辅助分析，未接入大模型或实时经济政策资料。详见 [五层结构与能力边界](docs/ENVIRONMENT-LAYERS.md)。

- 今日简报：从 10 封明确标注为虚构的演示邮件中呈现两条待处理事项。
- 邮箱整理：筛选、搜索、查看理由和详情、选择当前结果；保护账户、订单和个人待回复邮件。
- 确认归档：列出本次对象，明确同意本地操作后才执行；确认 5 分钟有效。
- 任务记录：逐项成功、失败与待核对；关联恢复记录，不覆盖历史。
- 偏好设置：保存时间、时区、免打扰；演示连接、导出、清除重置。
- 异常体验：在设置里选择部分失败或响应丢失，再执行一次整理；未知结果可核对，不能盲目重试。
- 个人成长：建立长期主题，写下现状与方向；围绕经历、观察、尝试反馈、反省和下一步持续记录。支持跨年时间线、前后对照、文字版本、收起恢复和主题导出。需要登录；本地运行保存于本机测试数据库，托管运行保存于当前生活空间的云端 D1；不依赖 Gmail 配置，不调用 AI。详见 `docs/PERSONAL-GROWTH.md`。

**简报、分类与归档操作仍为本地演示。** 已加入独立的真实 Gmail 只读服务端和设置入口，沿用 Sites 身份、D1 数据库及加密令牌存储。Google 配置尚未完成，真实账户联调未做；当前不会读取真实邮箱。真实读取结果只在设置页内存展示，不写入演示 localStorage，也不调用 AI。后台调度、真实归档与完整生产功能尚未实现。

## 皮肤与动态

顶部栏、宽屏对页导航栏或「偏好设置 → 外观与动态」可切换两套皮肤，控件同步：

- 光屿工作台（`island`，默认）：浅蓝与白色、清晨湖景；桌面竖向导航，连续记录旁呈现下一步尝试。
- 对页观察室（`observatory`）：炭灰导航、冷暖对照；1200px 起使用横向导航，成长主题旁有现状与方向及湖景小窗。首次进入成长页默认前后对照。

之后切换皮肤保留当前视图、未保存输入、焦点与滚动位置。「流光山水」以三道有留白的光流、细线轮廓、半透明水色与流动粒子构成整体背景，延伸到 LifeAtlas 标识与导航栏；导航区域复制同一场景的对应坐标，共用一个时间和绘制循环。已移除灰尘般的模糊圆点、光絮和点击涟漪。鼠标附近粒子流轻轻让开。正文面板保持不透明；Canvas 不接受点击，不收集或上传指针数据。「粒子动态」统一控制两处；文字输入、页面隐藏或系统启用减少动态时取消绘制循环并保留静帧。桌面最多 30fps，640px 及以下减少点数和像素比例、最多 24fps；主画布位图上限两百万像素。1050px 及以下成长布局变为单栏；640px 及以下保留五个导航入口；560px 及以下对照纵向排列。

偏好沿用当前浏览器的 `lifeatlas-appearance-v1` 键，保存结构升级为 `{version:2, skin:'island'|'observatory', particles:boolean}`。旧版 `version:1` 的 `daylight`、`orbit`、`habitat` 均迁移到 `island`，保留粒子开关；无效或缺失偏好回到 Island、粒子开启。迁移后的值在下次保存外观时写入。旧三套皮肤已退出选择器和规范调色板。浏览器拒绝存储时，本次切换仍生效，设置页提示未保存。外观偏好不包含成长正文，云端 D1／本地数据库记录不受影响。

设计令牌见 `DESIGN.md`；阴影、动态、断点和自包含组件示例见 `.impeccable/design.json`。`public/images/dawn-lake.webp`（52,390 bytes）为独立生成的装饰湖景，附有来源侧车；没有裁切参考界面，也没有把参考图中的照片、数量、分类或 AI 分析当作个人数据。

独立评审为 SHIP，未发现实质回归。视觉证据限实际 636×534px 应用内浏览器画面；390px、1440px 的两皮肤 × 五路由 DOM 检查显示无横向溢出且有五个导航入口。模拟截图出现裁切／拼接问题，不能据此认证完整桌面还原或移动端视觉。有效截图在 `.impeccable/review/replacement-island-top.png`、`replacement-island-records.png`、`replacement-observatory-top.png`、`replacement-observatory-compare.png`、`replacement-settings.png`；它们不是发布资产。

## 本地运行

要求 Node.js 22.13+（本次使用 24.13）及 npm。正式工程已迁移到 Sites Vinext 服务端，保留原 TypeScript 界面。

```powershell
npm ci
npm run dev
```

使用终端显示的本地 URL。服务端构建：`npm run build`；类型检查：`npm run typecheck`；测试：`npm test`（使用 Node 实验性 TypeScript 转换与内存 SQLite；本次 Node 24.13 通过）。依赖版本由 package-lock.json 锁定。

## 代码入口

- `src/main.ts`：五个页面的导航、演示确认对话框、事件和演示存储。
- `src/growth.ts`、`src/growth-model.ts`、`src/growth.css`：独立成长过程界面；`server/growth-*` 和 `app/api/growth/` 处理真实个人记录。
- `src/domain.ts`：演示对象、确认快照、保护规则、执行、取消、结果核对和恢复。
- `src/style.css`、`src/growth.css`、`src/skins.css`：依次加载的基础、成长界面和最终皮肤令牌/响应式覆盖。
- `src/appearance.ts`：皮肤选择、同步、浏览器偏好和粒子暂停。
- `tests/domain.test.ts`：关键授权与执行边界测试。
- `docs/STARTUP.md`：复查结论、依赖事实、下一步工作及完成条件。
- `server/` 与 `app/api/gmail/`：只读授权、用户隔离、加密存储、刷新、断开与受限读取。
- `db/schema.ts` 与 `drizzle/`：连接、授权状态及成长记录／修改版本表，迁移由部署流程应用。
- `docs/GOOGLE-SETUP.md`：下一步本人配置 Google 项目和安全运行时值的步骤。

## 进展与下一步

2026-10-29：模块更名为“个人成长 / 环境感知”，紧随“今日”；环境档案改为五层，增加职业、专业、行业与宏观影响路径，分析 v2 保留旧版记录。60 项自动测试、类型检查与构建通过。正式源码仓库 [hjfieohj/lifeatlas](https://github.com/hjfieohj/lifeatlas) 已公开，后续更改持续提交到该仓库。详见 [五层结构](docs/ENVIRONMENT-LAYERS.md)。

2026-10-25 已加入环境感知第一版：维护主题环境、给经历保留当时环境、前后对照、来源与待核实信息，并纳入检索与导出。说明见 [docs/ENVIRONMENT-AWARENESS.md](docs/ENVIRONMENT-AWARENESS.md)。该版 45 项自动测试通过。

2026-10-19 已增加成长过程的明确反馈关联、按关键词／日期检索、带原文依据的阶段回顾。参考项目、用法、存储边界和验证记录见 [docs/GROWTH-RESEARCH.md](docs/GROWTH-RESEARCH.md)。该版 39 项自动测试通过。

按 `docs/GOOGLE-SETUP.md` 完成独立 Google Cloud OAuth 配置后，做本人真实邮箱只读联调。真实接入先只读、后归档，不把 ChatGPT 中的现有 Gmail 连接或浏览器登录态当成本产品凭证。不要把客户端密钥、访问令牌或真实邮件粘贴进聊天或提交代码。
