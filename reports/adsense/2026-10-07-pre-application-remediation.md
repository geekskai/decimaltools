# DecimalTools AdSense 申请前整改报告

日期：2026-10-07（Asia/Shanghai）

状态说明：本报告记录本地源码和本地检查结果，不代表线上部署、广告后台或 AdSense 审核结论。

## 状态概览

| 项目 | 状态 | 说明 |
|---|---|---|
| P0-1 隐私披露 | PASS（本地文案）/ BLOCKED（生产核实） | 清理模板数据并补充 Clarity、Google 广告及用户可用控制说明。Umami 环境变量、生产脚本、Clarity masking 和真实线上服务状态未提供，需发布前核实。 |
| P0-2 服务条款 | PASS | 移除下载器、媒体处理、虚构配额和无依据司法辖区描述；补充数学精度、舍入、表格适用范围和独立核验提示。 |
| P0-3 分数目录文案 | PASS | 将搜索模式、landing page 等站长措辞改为分数算例、计算步骤和用户工具入口；导航链接保留。 |
| P1-1 分数页解释 | PASS（模型/构建） | 增加长除法余数步骤、循环节、有限位数、假分数拆分和校验式。路由构建仍生成110条白名单页面。 |
| P1-2 12个工具说明与输入验证 | BLOCKED（完整逐页实操） | 本轮新增说明涵盖时间、Gauge 和分数精度；方案列举的完整工具输入矩阵及浏览器交互尚未完成。钻头参考测试不是12个工具的整体验收。 |
| P1-3 三篇指南 | PASS（内容级 SEO 与本地构建） | 三篇文章经 SEO 复核并扩展，使用项目现有 default 作者档案、真实修改日期、唯一 title/summary、关键词、相关工具和文章内链；时间/数学/Gauge 依据分别链接 NIST、OpenStax、ASTM 测量实践及对照表。生产构建确认路由生成。 |
| P2-1 广告布局/同意 | PASS（默认关闭与响应式源码）/ BLOCKED（设备与后台） | 广告开关仍默认关闭；容器改为自适应宽度。未完成360/390/768/1440px浏览器实测、真实 ads.txt/账户核对和 Google 认证 CMP 后台验证。 |
| P2-2 最终回归 | PASS（SEO/钻头/构建/lint）/ BLOCKED（类型/浏览器/线上） | SEO 21/21、钻头参考7/7、生产构建成功、修改文件 lint 通过。tsc 单独检查受现有配置/依赖解析阻塞；浏览器真实交互和线上 DOM/网络检查未执行。 |

## 主要代码与内容修改

- `app/privacy/page.tsx`：删除账户/个人资料模板和纽约地点；补充 Clarity 与 Google 广告/Cookie 说明、Google 广告设置入口；生产环境各可选服务状态需确认。
- `components/ClarityTracker.tsx`：去掉硬编码 Clarity 项目 ID，只有配置 `NEXT_PUBLIC_CLARITY_PROJECT_ID` 时才启动。
- `app/terms/page.tsx`：统一为数学、测量、时间和字符编码计算/转换服务；说明有限与循环小数显示、舍入精度、参考表范围和关键结果核验；不指定司法辖区。
- `lib/fraction-math/page-model.ts`、`app/[locale]/tools/as-a-decimal/[slug]/page.tsx`：共享整数长除法模型和服务端说明。
- `messages/en.json`、`data/pseo-fractions.ts`：清理面向搜索引擎的措辞并更新分数页内容日期/版本。
- `components/GoogleAdUnitWrap.tsx`：广告容器改为宽度自适应，原默认关闭开关保持不变。
- 三篇指南：`data/blog/tools/why-1-30-hours-is-1-5.mdx`、`data/blog/tools/terminating-repeating-decimals-and-rounding.mdx`、`data/blog/tools/understanding-material-gauge-thickness.mdx`。
  - 后续 SEO 复核扩写后的正文约524、723、528词；三篇各含2个站内链接，title 长度31–58字符，summary 长度140–151字符。Gauge 文章引用的 ASTM A1073/A1073M 是钢板测量实践来源，文中明确未将其作为 Gauge 转换表背书。

## 验证证据

- `yarn test:seo`：21 个测试通过，0 失败（含新增分数模型测试）。
- `yarn test:drill-reference`：7 个测试通过，0 失败。
- `yarn build`：通过；Next.js 生成143页，其中分数动态路由显示110条白名单项，3篇新指南均被生成。
- 对本次 TS/TSX/MJS 修改文件执行 ESLint `--no-fix`：无错误。
- `tsc --noEmit`：BLOCKED；输出包括 `pliny` 缺少多个已导出子路径、现有 ES6 target 不支持 BigInt 字面量。Next build 自身跳过类型验证，所以构建通过不等于单独类型检查通过。
- 浏览器视口、工具交互、网络请求、发布 DOM、线上 Umami/Clarity 配置、ads.txt 和 CMP 后台：未验证。

## 发布前待确认

1. Vercel/生产环境的 `NEXT_PUBLIC_CLARITY_PROJECT_ID` 与 `NEXT_UMAMI_ID` 实际配置；确认 Umami 是否启用、Clarity 的输入屏蔽与同意行为。
2. Google 广告账户 publisher ID、线上 `ads.txt` 和广告投放区域 CMP 设置；必要时确认个性化广告与分析同意的分别处理。
3. 隐私政策中的真实运营主体/联系方式与用户数据处理流程，由负责人确认后再补充可公开事实。
4. 使用浏览器完成核心工具正常/边界/无效输入，以及广告布局四种宽度验证；发布后核查页面源码、DOM、网络请求、canonical、重定向和404。
5. 三篇指南中的外部一手来源核验仍待完成；Gauge 表格来源应另行确认其材料标准与适用范围。

## 发布状态

本地整改代码已完成并通过列出的本地检查；线上隐私/广告配置与浏览器验收仍阻止宣称“申请准备全部完成”。广告保持关闭。本改动未提交、未部署，也未操作广告后台或提交 AdSense 申请。整改不构成审核通过保证。
