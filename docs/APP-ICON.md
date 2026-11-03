# LifeAtlas 应用图标：Aurora Nebula / 极光星云

2026-11-03，用户选择“极光星云”：一条倾斜、折叠的彩色丝带围出开放中心，薄荷、珍珠与紫罗兰渐变形成前后层次，右上方保留一颗简化引导星。深午夜色圆角底块保持小尺寸轮廓。它是 LifeAtlas 原创 SVG 几何，不放字母或文字；原有 LifeAtlas 字标仍用于应用导航。此前 Atlas Orbit 的白色拱形与薄荷轨道、v2 文件名已被本次方向取代。

## 源文件与导出

唯一几何源文件是 `public/brand/lifeatlas-app-icon.svg`，画布为 1024 × 1024，底块圆角为 232 SVG 单位，外角透明。标志由填充的贝塞尔丝带轮廓、折面与少量边缘高光构成，中央开口保留底色；没有旧版拱形/轨道的固定描边宽度。引导星位于画布右上侧，由一条四向尖角路径形成。

| 局部角色 | SVG / provenance 值 |
| --- | --- |
| 午夜底色 | 主色 `#111c34`；底块渐变 `#243653` → `#111c34` → `#101427` |
| 薄荷前缘 | `#6be0d3` |
| 珍珠亮面 | `#b7eddd` |
| 紫罗兰折面 | `#a08dd8` |
| 引导星 | `#effaf5` |

完整渐变停靠点和路径以 SVG 为准；这些是图标资产的局部值，不新增应用主题 token。`public/brand/app-icon-provenance.json` 记录用户选择、原创几何、生成方式、参考用途和无付费服务声明。

| 文件 | 用途 |
| --- | --- |
| `public/brand/lifeatlas-app-icon.svg` | 原始矢量几何 |
| `public/brand/app-icon-provenance.json` | 来源、尺寸、版本和生成方式 |
| `local/lifeatlas-icon.png` | 1024px PNG，带 `impeccable:prompt` 来源元数据 |
| `local/lifeatlas.ico` | Windows 十尺寸图标源 |
| `public/favicon.svg` / `public/knowledge-universe/favicon.svg` | 同一几何的应用与独立知识宇宙 favicon 副本 |
| 构建目录中的 `LifeAtlas.ico` / `LifeAtlas-Aurora-v3.ico` | 本地发布图标与当前版本别名 |
| 构建目录中的 `LifeAtlas.exe` | 嵌入相同图标的原生启动程序 |

在项目根目录运行：

```powershell
python scripts/build-local-icon.py
node scripts/build-local.mjs
```

本机需已有 Node.js、项目 Sharp 依赖、Python 与 Pillow。`scripts/build-local-icon.py` 调用 `scripts/render-app-icon.mjs`，先由 Sharp 将 SVG 栅格化为 PNG，再写入 PNG 来源元数据并由 Pillow 输出 ICO。ICO 包含 16、20、24、32、40、48、64、96、128、256px 共十帧。`scripts/build-local.mjs` 复制两个 ICO 别名并编译嵌入图标的原生启动程序；改动几何后应顺序重建，保持 PNG、ICO、favicon 和 EXE 一致。

## Windows 与 favicon 缓存

`scripts/install-local-shortcuts.ps1` 使用 `LifeAtlas-Aurora-v3.ico`，计算 SHA-256 前 12 位内容哈希，复制成 `LifeAtlas-Shortcut-<内容哈希>.ico` 供桌面和开始菜单快捷方式引用。主快捷方式启动 `LifeAtlas.exe`。安装脚本通过文件句柄解析实际安装路径，让目标和图标使用同一物理目录；保存快捷方式后通知 Windows Shell 更新项目和桌面目录。无需终止 Explorer 或批量清空系统图标缓存，也不处理用户资料目录。

Web 入口 `app/layout.tsx` 与 `scripts/build-local.mjs` 生成的本地 HTML 均使用 `/favicon.svg?v=atlas-aurora-v3`。独立知识宇宙使用同目录的 `favicon.svg?v=atlas-aurora-v3`；`scripts/render-app-icon.mjs` 从唯一 SVG 同步输出两个副本。后续几何更新应同步调整资源和查询版本。

这些是当前源码和构建行为，不能代替已安装副本的实际确认。安装后另核对快捷方式的物理目标路径、图标内容哈希及安装目录的 BUILD-INFO；公开版本以 GitHub Release 的文件和校验值为准。

## 参考与验证

参考 [Apple App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) 的集中隐喻、简洁轮廓和小尺寸识别原则；只借鉴原则，不复制 Apple 标志、字体、符号或第三方商标路径。没有使用生成图片或外部位图。

当前证据位于 `C:/Users/zzb01/Documents/Codex/2026-11-02/new-chat/work/icon-aurora/`：

- `size-check.png`：从实际 ICO 解码的 128/64/48/32/24/16px 帧，分别放在明暗背景；文档记录者已直接查看。
- `icon-check.json`：核实十个实际帧尺寸及透明外角，记录 Sharp → Pillow 管线与无付费服务。
- `native-check.json`：从原生 EXE 提取 32px 图标，与 ICO 同尺寸帧逐像素一致；文档记录者已读取该结果。

以上验证图标资产和原生资源，不声称已观察桌面、开始菜单或任务栏的实时显示，也不代表整个应用或外部连接通过验证。

生成只使用本机已有的开源工具和原始 SVG，不调用付费 API、图像生成模型或云渲染。消耗为本机 CPU、内存与磁盘；对话评审仍计入现有模型额度。
