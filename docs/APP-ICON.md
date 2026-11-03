# LifeAtlas 应用图标：Atlas Orbit

Atlas Orbit 使用柔白色的 Atlas 拱形与一条上升的薄荷色轨道，表达 A、入口与探索。深海军蓝底块保留轻微明暗变化，让两个笔画在桌面小尺寸下仍有清晰轮廓。图标不放文字或星空细节。应用里的 LifeAtlas 字标、导航、两套主题和现有资料不随此次图标调整而改变。

## 源文件与导出

唯一几何源文件为 `public/brand/lifeatlas-app-icon.svg`，画布为 1024 × 1024。底块圆角为 232，拱形线宽为 92，轨道线宽为 66，均为 SVG 画布单位。笔画使用圆端与圆连接；底块外角透明。

| 局部颜色 | SVG 值 |
| --- | --- |
| 底块渐变 | `#263753` → `#101827` |
| 拱形 | `#F3F7FC` |
| 轨道 | `#80DDCD` |

这些是图标资产的局部值，不新增应用主题 token。

| 文件 | 用途 |
| --- | --- |
| `public/brand/lifeatlas-app-icon.svg` | 原始矢量几何 |
| `public/brand/app-icon-provenance.json` | 来源、参考、尺寸与生成方式记录 |
| `local/lifeatlas-icon.png` | 1024px PNG |
| `local/lifeatlas.ico` | Windows 多尺寸图标 |
| `public/favicon.svg` | 从同一 SVG 复制的 favicon |

在项目根目录运行：

```powershell
python scripts/build-local-icon.py
node scripts/build-local.mjs
```

本机需已有 Node.js、项目的 Sharp 依赖、Python 与 Pillow。Python 脚本先调用 `scripts/render-app-icon.mjs`，由 Sharp 将 SVG 栅格化为 PNG，再由 Pillow 输出 ICO。ICO 包含 16、20、24、32、40、48、64、96、128、256px 共十帧。构建本地程序时，图标同时复制为 `LifeAtlas.ico` 和 `LifeAtlas-Orbit-v2.ico`；原生 C# 启动程序嵌入该图标。若修改几何，应先重新生成图标，再执行项目原生启动程序的编译步骤，避免只更新外部 ICO 而保留旧的 EXE 资源。

## Windows 与 favicon 缓存

桌面与开始菜单快捷方式使用从 `LifeAtlas-Orbit-v2.ico` 复制的 `LifeAtlas-Shortcut-<内容哈希>.ico`，启动目标为 `LifeAtlas.exe`。安装脚本通过文件句柄解析实际安装路径，让启动目标和图标使用同一物理目录，避免打包宿主重定向 LocalAppData 后，资源管理器读取到另一位置。内容哈希让图标变化时自动获得新的缓存键；保存快捷方式后通知 Windows Shell 更新项目和桌面目录。无需终止 Explorer 或批量清空系统图标缓存，也不涉及用户资料目录。

Web 入口 `app/layout.tsx` 与本地入口生成的 HTML 均使用 `/favicon.svg?v=atlas-orbit-v2`。后续更新时同步调整查询版本，保持两个入口一致。

## 参考与验证

参考 [Microsoft 应用图标设计](https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-design) 与 [Apple App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) 中的简洁中心隐喻和小尺寸识别原则。没有使用或临摹第三方商标图形；SVG 为 LifeAtlas 原创代码几何，完整记录见 provenance 文件。

已解码检查 ICO 的十个实际尺寸与透明外角，并将各帧置于明暗背景上查看。证据位于 `C:/Users/zzb01/Documents/Codex/2026-11-02/new-chat/work/icon-design/size-check.png` 与同目录 `icon-check.json`。这些证据验证图标资产，不代表已拍摄 Windows 桌面、开始菜单或任务栏的实时显示效果。

生成过程仅使用本机开源工具与原始 SVG，不调用付费 API、图像生成模型或云渲染。消耗为本机少量 CPU、内存与磁盘；后续对话评审仍计入现有模型额度。
