# LifeAtlas 下载与使用

项目主页：https://github.com/hjfieohj/lifeatlas

最新公开版本：https://github.com/hjfieohj/lifeatlas/releases/latest

## 下载哪个文件

- `LifeAtlas-Windows-x64.zip`：完整 Windows 本地程序，包含 Node 24.13.0、原生桌面入口、全部现有模块、知识星云、图标、字体和许可文件。不需要先安装 npm 或打开 Codex。
- `LifeAtlas-Source.zip`：该版本的完整项目源码。也可以直接从仓库克隆或使用 GitHub 的 Code → Download ZIP。
- `Knowledge-Universe-Offline.zip`：仅独立知识宇宙，包含政治与资本等七个领域、多层框架及跨领域联系。使用浏览器保存笔记，不包含完整程序的成长数据库服务。
- `LifeAtlas-Icons.zip`：原创图标的 SVG、PNG、ICO、来源记录和设计说明。
- `SHA256SUMS.txt`：以上下载文件的 SHA-256 校验值。

## Windows 本地程序

1. 下载完整 Windows x64 包并完整解压，不能只从压缩包里拖出一个 EXE。
2. 推荐放在固定目录，例如 `%LOCALAPPDATA%\LifeAtlas\程序`，保留 `runtime`、`web`、`migrations` 等目录。
3. 双击 `LifeAtlas.exe`。检测到 Chrome/Edge 时使用独立应用窗口，否则使用默认浏览器。Windows 原生入口使用系统 .NET Framework；核心界面仍在本机服务上运行。
4. 也可访问 `http://localhost:5173/#knowledge`。程序只监听本机，不开放公网或局域网。
5. 若需要桌面图标，可为 `LifeAtlas.exe` 创建快捷方式；包内双击 `Install-Desktop-Shortcut.cmd` 可创建桌面和开始菜单图标，源码对应 `scripts/install-local-shortcuts.ps1`。

原生入口接受 `open`、`start`、`stop`、`backup` 参数。默认双击为 `open`；在 PowerShell 中运行 `./LifeAtlas.exe stop` 可完全停止服务，`./LifeAtlas.exe backup` 可备份资料。

## 数据、备份和升级

首次使用会在程序旁的 `LifeAtlas本地资料` 中创建个人资料。**公开下载包不包含任何人的记录。** 成长记录按保存按钮提交，知识笔记和偏好自动同步；等待「已保存到本机」再关闭窗口。

在「偏好设置 → 本地资料与备份」生成完整备份或恢复。每次启动本机服务会自动备份；建议定期把完整备份另存其他磁盘。升级前先备份并停止服务，只替换程序文件，保留资料目录；恢复前也会自动备份当前资料。

旧 `file://` 知识页面与本地程序的浏览器来源不同。在旧页面导出 JSON，再到新版知识宇宙导入；不要先清理旧浏览器数据。

## 独立知识宇宙

解压 `Knowledge-Universe-Offline.zip`，保留整个目录，打开里面的 `index.html`。拖动自由翻转，缩小隐藏名称，放大后显示贴合核心的名称。资源和摘要可离线使用；维基百科等外部资料需要网络。个人笔记存在该浏览器，建议定期用页面中的导出功能备份。

## 能力范围

v0.5.0 本地版去掉原型运行组件，包含真实成长记录、投资研究日志、生活记录、待办、可上传文件和创建独立星云的知识宇宙、AI 分析与 Gmail/163/QQ 只读邮箱。界面采用苹果风格的轻盈导航、胶囊按钮和连续阅读面板，皮肤为暗色星空和亮色蓝天白云；桌面图标更新为原创极光星云。记录支持查找、渐进加载和回收站恢复；连续输入合并保存，AI 结果按所属内容恢复并支持历次记录翻页。

偏好设置中可填写自己的 AI 基础地址、模型与密钥；本机 Ollama 可使用 `http://localhost:11434/v1`（需先准备模型）。在成长、投资、生活、知识笔记等当前填写区下方使用 AI：空白时引导开始，有内容时总结扩展。预览引用并点击发送后才请求；问题、引用和结果按原内容保存在本机。

知识宇宙 → 星云与知识库可上传 TXT、Markdown、JSON、CSV、PDF、DOCX，组成新星云或并入已有星云。原文件与提取文本合计50MB；单文件20MB，自建节点最多500个。扫描版PDF需先OCR。

邮箱使用客户端授权码 / 应用专用密码，需先开启相应账号的 IMAP；Gmail 还取决于两步验证与账号策略。同步最近50封标题，打开邮件时缓存文本正文。不发送、删除、归档或标记已读。真实账号需用户自行配置验证。

程序包内附《本地功能与连接指南.md》，详细说明见源码 `docs/LOCAL-WORKSPACE.md`。

离线记录和文件解析不调用外部模型。连接远程 AI 后，只有用户发起的分析会调用自己的服务，费用取决于服务商；本机模型使用本机算力。连接密钥单独加密保存，完整资料备份不包含密钥，换电脑后需重新填写。发布包在本机 Windows x64 环境构建并验证，未声称已在所有系统和设备上测试。

## 文件校验

下载同一发布页的 `SHA256SUMS.txt`，在 PowerShell 检查文件，例如：

```powershell
Get-FileHash ./LifeAtlas-Windows-x64.zip -Algorithm SHA256
```

结果应与校验文件中相应条目一致。程序、源码与图标的许可及参考说明随各包提供。
