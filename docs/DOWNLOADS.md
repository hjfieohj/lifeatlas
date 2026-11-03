# LifeAtlas 下载与使用

项目主页：https://github.com/hjfieohj/lifeatlas

最新公开版本：https://github.com/hjfieohj/lifeatlas/releases/latest

## 下载哪个文件

- `LifeAtlas-Windows-x64.zip`：完整 Windows 本地程序，包含 Node 24.13.0、原生桌面入口、全部现有模块、知识星云、图标、字体和许可文件。不需要先安装 npm 或打开 Codex。
- `LifeAtlas-Source.zip`：该版本的完整项目源码。也可以直接从仓库克隆或使用 GitHub 的 Code → Download ZIP。
- `Knowledge-Universe-Offline.zip`：仅独立知识宇宙，包含六大领域、多层框架及跨领域联系。使用浏览器保存笔记，不包含完整程序的成长数据库服务。
- `LifeAtlas-Icons.zip`：原创图标的 SVG、PNG、ICO、来源记录和设计说明。
- `SHA256SUMS.txt`：以上下载文件的 SHA-256 校验值。

## Windows 本地程序

1. 下载完整 Windows x64 包并完整解压，不能只从压缩包里拖出一个 EXE。
2. 推荐放在固定目录，例如 `%LOCALAPPDATA%\LifeAtlas\程序`，保留 `runtime`、`web`、`migrations` 等目录。
3. 双击 `LifeAtlas.exe`。检测到 Chrome/Edge 时使用独立应用窗口，否则使用默认浏览器。Windows 原生入口使用系统 .NET Framework；核心界面仍在本机服务上运行。
4. 也可访问 `http://localhost:5173/#knowledge`。程序只监听本机，不开放公网或局域网。
5. 若需要桌面图标，可为 `LifeAtlas.exe` 创建快捷方式；源码中的 `scripts/install-local-shortcuts.ps1` 提供桌面和开始菜单入口安装。

原生入口接受 `open`、`start`、`stop`、`backup` 参数。默认双击为 `open`；在 PowerShell 中运行 `./LifeAtlas.exe stop` 可完全停止服务，`./LifeAtlas.exe backup` 可备份资料。

## 数据、备份和升级

首次使用会在程序旁的 `LifeAtlas本地资料` 中创建个人资料。**公开下载包不包含任何人的记录。** 成长记录按保存按钮提交，知识笔记和偏好自动同步；等待「已保存到本机」再关闭窗口。

在「偏好设置 → 本地资料与备份」生成完整备份或恢复。每次启动本机服务会自动备份；建议定期把完整备份另存其他磁盘。升级前先备份并停止服务，只替换程序文件，保留资料目录；恢复前也会自动备份当前资料。

旧 `file://` 知识页面与本地程序的浏览器来源不同。在旧页面导出 JSON，再到新版知识宇宙导入；不要先清理旧浏览器数据。

## 独立知识宇宙

解压 `Knowledge-Universe-Offline.zip`，保留整个目录，打开里面的 `index.html`。拖动自由翻转，缩小隐藏名称，放大后显示贴合核心的名称。资源和摘要可离线使用；维基百科等外部资料需要网络。个人笔记存在该浏览器，建议定期用页面中的导出功能备份。

## 能力范围

包含今日、个人成长/环境感知、知识宇宙、投资、人生丰富度、邮箱整理、任务记录与设置。邮件整理和部分今日内容仍为明确标注的演示；真实 Gmail 需要联网、配置和授权。当前分析是规则辅助，未自动接入大模型、实时行情或真实交易。

本地核心运行不调用模型或付费 API，使用本机 CPU/GPU、内存与磁盘。发布包在本机 Windows x64 环境构建并验证，未声称已在所有系统和设备上测试。

## 文件校验

下载同一发布页的 `SHA256SUMS.txt`，在 PowerShell 检查文件，例如：

```powershell
Get-FileHash ./LifeAtlas-Windows-x64.zip -Algorithm SHA256
```

结果应与校验文件中相应条目一致。程序、源码与图标的许可及参考说明随各包提供。
