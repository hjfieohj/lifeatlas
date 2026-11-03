# LifeAtlas 本地程序

2026-11-03：整个应用作为本人电脑上的长期记录程序，浏览器实现。Windows 安装版采用现有静态界面、Node.js 24.13.0 服务与 SQLite，核心运行不依赖 Codex、云端身份或网络。

## 日常使用

Windows 桌面与开始菜单直接调用 `LifeAtlas.exe`，不依赖 Windows Script Host 或 VBS 路径解析。原生入口使用系统已有 .NET Framework，后台调用随程序附带的 Node 运行时。旧版遗留的 VBS 文件不再作为正式入口。

本机正式安装在 `%LOCALAPPDATA%/LifeAtlas/程序`，个人资料独立保存在 `%LOCALAPPDATA%/LifeAtlas/LifeAtlas本地资料`；免安装包解压为 `LifeAtlas本地程序` 时，仍使用程序旁的同名资料目录。双击桌面 LifeAtlas 或 `LifeAtlas.exe` 进入知识宇宙；有 Edge/Chrome 时打开独立应用窗口，否则使用默认浏览器。关闭窗口后后台服务仍在，再次打开即可继续；开始菜单的“停止LifeAtlas”结束该服务。默认地址为 `http://localhost:5173/#knowledge`，服务只绑定 `127.0.0.1`，不开放局域网、不注册系统服务或开机启动。

升级前先备份并停止程序，再只替换程序目录，保留资料目录。启动异常先查看资料目录里的 `application.log`，检查是否有旧服务占用端口；不要删除数据库来解决启动问题。

## 记录保存在何处

- `lifeatlas.sqlite`：成长记录、版本及既有历史，以及知识笔记、收藏、演示状态、外观和可选模块设置。
- `settings.json`：稳定本机身份及会话配置，成长记录不需要在线登录；这不是多人账户系统。
- `backups/`：启动、手动备份和恢复前的一致性备份。
- `runtime.json`、`application.log`：后台控制信息和日志。

成长编辑仍需明确保存，保留原有版本与并发检查。知识和设置的四个既有浏览器存储键经本地桥同步入库，新浏览器从磁盘载入已保存值；变更带版本与幂等标识，待保存日志和冲突内容另行留存，不承诺多窗口自动合并。

显示「正在保存或等待重试」时请等待。遇到保存错误，先保留窗口，在设置中「导出本窗口草稿」，再恢复服务或刷新。再次打开会尝试提交此前未完成的日志；冲突草稿保留，界面显示磁盘资料。草稿导出不能替代完整备份。资料为普通本机磁盘文件，非端到端加密。

## 备份与恢复

「偏好设置 → 本地资料与备份」显示状态和资料目录。点击「备份全部资料」先等待当前窗口及知识框架同步，再下载完整 JSON，并在资料目录 `backups/` 留一份。安装目录的 `LifeAtlas.exe backup` 也可生成磁盘备份。每次启动自动备份；同盘备份不能抵御磁盘损坏，应将完整备份另存其他磁盘。当前没有自动异地备份或自动清理策略。

完整备份是 `lifeatlas-local-backup` v1，包含 SQLite base64、SHA-256、创建时间与 owner。「从备份恢复」选文件后要求明确确认替换；服务校验格式、校验和、数据库完整性与所需表结构，先备份现有资料，再替换。恢复完成后刷新。校验用于检查文件完整性，不代表加密或签名。

知识宇宙自己的 JSON 只导入/导出知识资料，不能代替全程序完整备份。完整备份与资料目录含个人内容，不进入公开源码或工程包。

## 旧资料

安装的 `--import-database` 在目标没有数据库时，先一致性备份旧成长数据库再复制，源库不改动，生成 `migration-report.json`。目标已有数据库时拒绝自动覆盖。是否迁移完成，以实际报告及记录检查为准，不根据安装功能推断迁移数量。

本轮实际安装已完成旧成长数据库的备份与复制，并对主题、经历及修改历史逐行核对；具体报告只保留在本机。桌面与开始菜单入口已建立，原开发服务已切换为打包的本机运行服务。浏览器资料仍按下面的来源边界迁移。

旧 `file://` 知识页与本机程序来源不同，需要在旧页导出 JSON，再到本地知识宇宙导入。首次初始化仅能带入当前来源已有的有效存储，程序不遍历其他浏览器、来源或历史资料。

## 能力与资源

本地化保留既有模块。今日、邮箱整理和任务记录仍是虚构演示；真实 Gmail 是尚待配置和本人账户联调的独立在线功能，不借用 Codex Gmail 连接或浏览器登录态。外部链接与资料需要联网。环境分析仍是有界规则辅助，投资、新闻和 AI 未因此新增实时数据、交易、来源验证或模型能力。

核心运行无模型调用，不消耗模型额度，不自动调用付费 API、购买服务或租云 GPU；消耗本机 CPU/GPU、内存和磁盘。

## 开发和安装

工程使用 Node.js 24.13.0。日常打开安装版；以下是开发命令：

```powershell
npm ci
npm run typecheck
npm test
npm run build:local
node scripts/install-local.mjs 'C:/absolute/path/LifeAtlas本地程序'
```

首次导入旧成长数据库可加 `--import-database 'C:/absolute/path/old.sqlite'`。源码 `dist-local` 默认使用被忽略的仓库 `.local-data`，安装版默认使用同级 `LifeAtlas本地资料`。

隔离检查可运行 `node dist-local/runtime/launcher.mjs start --data-dir 'C:/absolute/path/test-data' --port 5174`；停止时换为 `stop`，保持相同目录和端口，避免接触日常资料。`npm run dev` / `npm run build` 保留原框架开发/构建用途。

`local/entry.ts` 复用既有界面和全部样式，仅增加本地资料设置与状态提示。esbuild 生成静态界面和服务包，安装后不依赖 React/云框架。`local/database.mjs` 用 Node 内置 SQLite 兼容现有 D1 服务接口，成长与 Gmail 服务复用。

安装脚本包含当前 Node 可执行文件，版本固定 24.13.0，官方该版本许可证随包在 `licenses/Node-LICENSE.txt`。`local/lifeatlas.ico` 派生于既有 `public/favicon.svg`，重建脚本 `scripts/build-local-icon.py` 的 Pillow 只用于构建，运行不需 Python。现有字标、字体和 Uiverse 的开源来源保持，无新增运行时字体或图片请求。

本地化实现验证：77 项测试、类型检查和本地构建通过；本地行为检查使用独立资料目录。本地设置表面说明为 `../.impeccable/surfaces/local-entry-ts.md`。固定目录安装已完成，成长资料逐行核对通过，具体报告保留在本机。
