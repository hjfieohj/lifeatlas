# 政治与资本星云

2026-11-03 按用户选择，把「政治与资本」加入第七个内置星系。它是本轮重点观察入口；没有把“两个群体是唯一或在所有社会中最有影响力”写成已验证的普遍结论。

## 内容结构

新增 **42 个节点、42 条包含关系、32 条概念联系、3 条学习路线**。整体内置图谱为七个领域、155 个数据节点（含宇宙根节点）、154 条包含关系、138 条概念联系、11 条路线。原有六个领域的113个节点及编号保留，个人笔记、自建星云和上传资料不迁移或覆盖。

六条主线：

1. **政治家与公共权力**：身份与权力边界、公共与组织目标、决策手段、治理的收益与代价、世界观、价值排序、人物研究卡。
2. **资本家与资本配置**：所有权与控制权、收益与存续等目标、投资和组织手段、社会价值与分配、世界观、利益相关者价值观、人物研究卡。
3. **政治与资本之间的关系**：合作、相互依赖与谈判、游说、政策俘获与寻租、旋转门与利益冲突、公共制衡。
4. **怎样影响大众生活**：工作与工资、税费与公共服务、住房、消费价格、信息环境、污染等公共成本。每个议题同时追踪可能的好处、代价、受影响者和条件。
5. **心理机制**：权力与注意、视角采择、道德认同、角色压力和反馈、个体差异。明确标注心理研究、分析视角与证据边界。
6. **怎样研究人物和事件**：不同解释框架、动机证据、分配与反事实、个人观察清单。为日后添加具体人物保留可核实的结构。

学习路线分别为「从角色走到生活」「怎样理解心理而不贴标签」「一项决策怎样进入普通人的生活」。与原有心理学、哲学、数学和股市节点建立有理由的跨领域联系。

## 证据与写作边界

节点摘要和教学情景为本项目原创。例子均注明为假想情景，不影射具体人物、企业或现实案件。制度机制、研究结果、研究者推断和规范性评价分别说明；不使用财富、职业、面相或视频印象诊断人格，不把群体研究均值当作个体定论。

政治家与资本家使用明确的工作定义，以便学习比较，不混同全部公务员、所有经理人、所有富人或所有证券持有人。人物的真实目的保留为有待证据支持的问题，公开表述、行动和推断分层记录。合法性与违法判断须核实具体地区、时间和适用规则，不凭获利、任职变化或关系接近断定腐败。

每个新节点都有自己的 HTTPS 来源清单；阅读面板优先显示节点来源，旧节点仍可使用领域通用来源。外部材料需联网，正文、教学例子、学习路线、笔记与图谱均可离线阅读。

## 主要来源与用途

- [OpenStax 政治的定义](https://openstax.org/books/introduction-political-science/pages/1-1-defining-politics-who-gets-what-when-where-how-and-why)、[公共政策与权力](https://openstax.org/books/introduction-political-science/pages/1-2-public-policy-public-interest-and-power)：概念入口。
- [OpenStax 企业与经济制度](https://openstax.org/books/introduction-business-2e/pages/1-3-how-business-and-economics-work)、[利益相关者](https://openstax.org/books/business-ethics/pages/3-1-adopting-a-stakeholder-orientation)：资本角色、企业与受影响者。
- [世界银行《2017世界发展报告》](https://www.worldbank.org/en/publication/wdr2017)：治理、权力不对称与俘获的分析框架。
- [OECD 游说与透明度](https://www.oecd.org/en/publications/anti-corruption-and-integrity-outlook-2024_968587cd-en/full-report/component-7.html)、[公职离任与利益冲突](https://www.oecd.org/en/publications/post-public-employment_9789264056701-en.html)、[公司治理](https://www.oecd.org/en/publications/g20-oecd-principles-of-corporate-governance-2023_ed750b30-en/full-report/component-8.html)：不同利益进入决策的机制与责任。
- [ILO 社会对话](https://www.ilo.org/topics-and-sectors/social-dialogue-and-tripartism)、[IMF 财政政策与不平等](https://www.imf.org/en/Blogs/Articles/2017/10/11/inequality-fiscal-policy-can-make-the-difference)、[OECD 住房](https://www.oecd.org/en/topics/housing.html)、[竞争](https://www.oecd.org/en/topics/competition.html)：生活影响的不同观察入口。
- [Keltner等，2003](https://greatergood.berkeley.edu/dacherkeltner/docs/keltner.power.psychreview.2003.pdf)、[Galinsky等，2006](https://business.columbia.edu/faculty/research/power-and-perspectives-not-taken)、[DeCelles等，2012](https://sites.nd.edu/lapseylab/files/2015/03/DeCelles-et-al-2012-Does-power-corrupt-or-enable.pdf)：具有样本和情境限制的心理研究；不据此推定政治家或资本家的共同人格。
- [SEP 资本主义](https://plato.stanford.edu/entries/capitalism/)、[共和主义](https://plato.stanford.edu/entries/republicanism/)、[Ostrom诺贝尔演讲](https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/)：比较制度、自由和多中心治理的不同视角。

其他来源见各节点「继续阅读」。本轮不新增具体在世人物的事实档案、实时政治新闻或心理画像。

## 维护与验证

数据源为 `public/knowledge-universe/knowledge.json`，运行 `node public/knowledge-universe/sync-data.cjs` 同步 `knowledge.js` 并校验编号、领域、层级、关系、路线和节点来源。新增领域沿用原有XYZ星云、粒子联系、缩放标签和保存机制，不修改两套皮肤或重新设计界面。

`tests/knowledge.test.ts` 检查新增分支、覆盖范围、来源、路线、跨领域联系和旧节点数量。另通过隔离资料检查独立版与完整本地版的入口、搜索、逐层阅读、收藏笔记与重开保存；发行包不含测试数据或个人资料。
