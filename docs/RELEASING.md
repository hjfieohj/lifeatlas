# 发布与复现

源码、资源、测试、迁移和构建脚本保存在主分支；可执行程序与下载文件放在 GitHub Releases，不把运行时二进制、私人数据库或备份混进 Git 历史。

## 本地构建

在 Windows x64、Node 24.13.0 环境安装锁定依赖并构建。Windows 原生入口使用系统 C# 编译器；已有 ICO/PNG 随源码提供，普通构建不需要重画图标。

```powershell
npm ci
npm run typecheck
npm test
npm run build:local
```

只有重新生成图标时才需要 Python/Pillow 和项目内 Sharp：`python scripts/build-local-icon.py`。

## 整理发布文件

确认工作区干净、代码已提交后：

```powershell
node scripts/package-release.mjs --version v0.2.0 --output-dir C:/absolute/path/release
```

打包器使用全新暂存目录，重新整理免安装程序、独立知识宇宙、图标及指南，使用 `git archive HEAD` 生成源码包，并记录提交号与校验值。它拒绝发布目录内的数据库、备份、运行日志、密钥文件或符号链接。不要用含个人资料的安装目录打包。

产物固定命名，README 的 `releases/latest/download/文件名` 链接可随最新版本更新。发布前验证压缩包清单、完整程序冷启动和校验值；Release 的标签应指向构建记录中的提交。

## 发布到公开仓库

使用 GitHub Release 上传所有产物，包括 `SHA256SUMS.txt`；正文写清现有能力与限制。可先建立 draft 并上传检查，最后发布。发布后检查公开页面、附件状态以及匿名下载链接。

不发布：个人资料目录、真实记录、浏览器导出、数据库、完整个人备份、OAuth 令牌、密钥及开发缓存。真实 Gmail 配置由使用者在本地自行提供。

0.2 本地包还应包含 `runtime/integrations.mjs`、PDF.js 本地实现、`licenses/integrations/INDEX.json` 与对应依赖许可、`Install-Desktop-Shortcut.cmd/.ps1`、本地功能与连接指南。解析器构建须在不带 node_modules 的暂存包中验证。连接凭据文件 `connection-vault.key/.enc` 永远不进入公开包。
