# Gmail 只读接入配置

代码已具备服务端 OAuth 与只读读取入口，但尚未用真实 Google 账户完成联调。先按下列步骤配置，再由本人完成授权与样本验收。此阶段不申请或执行发送、删除、归档。

## 需要配置的值

| 服务端配置名 | 含义 | 是否保密 |
|---|---|---|
| APP_ORIGIN | `https://lifeatlas-firstlight-1017.groovybirch18.chatgpt.site`，结尾不要加斜杠 | 否 |
| GOOGLE_CLIENT_ID | Google Web application 的客户端 ID | 是，按本项目统一放运行时配置 |
| GOOGLE_CLIENT_SECRET | 同一客户端的密钥 | 是 |
| TOKEN_ENCRYPTION_KEY | 32 字节随机密钥的 Base64 编码，用于 AES-GCM | 是 |
| DB | 托管平台提供的 D1 绑定；由部署配置与迁移建立 | 不需要手填密码 |

密钥只进入 Sites 运行时 Secrets，不能出现在前端、聊天、代码仓库或截图中。当前这四项运行时值均尚未设置，连接按钮应处于不可用状态。

## Google Cloud 配置顺序

1. 在本人 Google Cloud 账号下选择或创建项目，启用 **Gmail API**。涉及账号登录、条款或计费选择时由本人完成；无需为本次演示购买额外服务。
2. 配置 OAuth 应用的名称、支持邮箱、受众与数据使用说明。个人开发阶段选择适用的测试状态，并把本人使用的 Google 账户加入测试用户。
3. 只声明 `https://www.googleapis.com/auth/gmail.readonly`。不要添加修改、发送、Drive 或 Calendar 权限。
4. 创建类型为 **Web application** 的 OAuth 客户端。登记以下准确回调（不含末尾斜杠）：

   `https://lifeatlas-firstlight-1017.groovybirch18.chatgpt.site/api/gmail/callback`

5. 通过安全配置把客户端 ID 与密钥填入 Sites 运行时，生成独立加密密钥并填入 `TOKEN_ENCRYPTION_KEY`。改变运行时后需要部署保存的版本，配置才能生效。
6. 打开应用的「偏好设置」，查看缺失配置清单是否清空，再由本人点击「连接 Gmail（只读）」并在 Google 页面核对和同意权限。
7. 返回应用后确认连接的邮箱，主动点击读取。首次只读取最近 7 天收件箱，最多 100 封；未授权、令牌过期、被 Google 阻止或部分读取失败时，保留错误，不把演示样本当真实结果。

本地联调使用 `http://127.0.0.1:5173/api/gmail/callback`，`APP_ORIGIN` 对应 `http://127.0.0.1:5173`。本地配置可从 `.env.example` 复制成被忽略的 `.dev.vars`；本地与线上回调均需要分别登记。初始化本地 D1 的说明见下方。

## 本地数据库

在项目目录运行以下命令，应用现有迁移到本地预览数据库；线上迁移由 Sites 部署处理，两者相互独立：

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_striped_turbo.sql
```

先运行一次 `npm run build` 生成上述本地配置文件，并且只应用尚未执行的迁移，不能重复执行已创建表的首份迁移。本轮本地迁移已应用时应跳过该命令；不能把本地迁移成功当作线上迁移已完成。不要对未确认的数据库执行手工结构修改。

## 验收与数据边界

- 托管平台登录只建立 LifeAtlas 用户身份；Google 同意才授权邮箱读取。
- OAuth state、浏览器 HttpOnly nonce、PKCE 和 5 分钟有效期共同校验；回调只能领取一次。
- 令牌 AES-GCM 加密并绑定所属用户；数据库只保存连接邮箱、加密令牌、时间与短期授权状态，不保存邮件正文、附件或扫描结果。
- 前端真实预览仅存在当前页面内存，离开设置页即清除；不写入演示 localStorage，不调用 AI 模型。
- 规则初筛只用于提示复核，不能当作模型准确率；账户、安全、订单及重要标记默认保护。
- 断开先撤销本产品本地访问，再尝试 Google 撤销。Google 撤销未确认时会提示本人到 Google 账户检查第三方访问。
- 尚未完成后台定时、真实归档、模型处理、生产数据导出与完整删除保留政策，当前不能宣称完整产品交付。

## 常见状态

- **配置尚未完成**：按缺失清单填写服务端运行时值；不是 Google 账号已连接。
- **redirect_uri_mismatch**：检查 Google 控制台与应用回调是否逐字符一致。
- **需要重新连接**：测试状态的刷新令牌可能 7 天失效，或用户在 Google 撤销了权限。
- **额外权限被拒绝**：本客户端只接受 Gmail 只读 scope；若沿用过宽授权，先在 Google 撤销该应用旧权限再试。
- **部分失败**：页面标出成功读取数量与失败数量；不自动扩大范围或追踪下一页。

官方依据：[Web OAuth](https://developers.google.com/identity/protocols/oauth2/web-server)、[Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)、[messages.list](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list)、[messages.get](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get)。
