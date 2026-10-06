# DecimalTools SEO 迁移与验收

验收日期：2026-10-06。范围：现有英文站点、本地生产构建。最终要求：**保留页面 FAQ 展示，删除全部 FAQPage 结构化数据**。

## 已交付

- 统一 canonical、Open Graph、Twitter 分享信息和安全 JSON-LD 序列化；保留英语无 `/en`、非根页面无尾斜杠的地址规则。
- 修复异步路由参数、非语言路由的英语上下文，以及首页/目录元数据被子页面错误继承的问题。
- 统一 Organization、WebSite、作者实体 ID；保留页面对应的 WebPage、CollectionPage、WebApplication、BreadcrumbList、BlogPosting。移除工具、分数专题和博客输出中的 FAQPage；可见 FAQ 保留。
- 博客尊重已有 canonicalUrl，草稿不进入文章列表、标签、分页或站内搜索索引。分页第一页永久跳转，非法和越界地址返回 404；后续有效分页有独立元数据及 CollectionPage。
- sitemap 覆盖 134 个规范页面，包括 12 个工具、分数聚合页、110 个分数落地页、文章及有文章的标签；移除自动刷新到当天的 lastmod，未知日期省略。博客原日期保留，三个英寸工具因描述实质调整更新日期。
- robots 允许 CSS 抓取，保留 API 限制和原有 AI 爬虫规则。
- 生成首页、工具目录及 12 个工具共 14 张 1200×630 DecimalTools 分享图；分数页面复用分数工具图，博客保留已有文章图。
- 区分三个相近英寸工具的标题与描述，增加计量、时间、编码、分数相关链接；修正目录、About、llms.txt 的实际产品定位。
- 新增只读 `seo:audit`，检查 sitemap、状态码、重定向、canonical、robots、标题描述、H1、语言、JSON-LD、分享图、内容图片和站内链接。输出 CSV 和 JSON；网络失败记为 BLOCKED，空 sitemap 不能通过，FAQPage 输出会被判为失败。

## 验收结果

| 检查 | 结果 | 实际证据 |
| --- | --- | --- |
| sitemap 全量服务端 HTML | PASS | 134/134；状态 200、允许索引、canonical 一致、单个 H1、英文、JSON-LD 可解析；无重复地址/标题 |
| 图片及站内链接 | PASS | 无缺失图片、坏链接或站内重定向警告；14 张生成图均为 1200×630 |
| FAQ | PASS | 134 页输出无 FAQPage；12 个工具、分数聚合/模板、博客均保留可见 FAQ |
| 边界路由 | PASS | 11 项状态/跳转检查；另有 2 项集成回归覆盖首次访问、非法和越界地址 |
| 单元及行为测试 | PASS | 26/26，包括原有 10 项测试 |
| 项目 ESLint（不自动修复） | PASS | `app components lib layouts scripts proxy.ts` 无错误 |
| 生产构建 | PASS | 136 个静态输出完成；项目原有忽略类型错误设置未更改 |
| 独立 TypeScript 检查 | FAIL | 40 条既有错误，基线 65 条；按文件、错误码、消息比较无新增。29 条 pliny 模块声明解析、11 条 BigInt/ES6 target 问题 |
| 额外检查 next.config.js | FAIL | 3 条既有 CommonJS require lint 错误；本次只增加分页重定向配置，未改动原有导入 |
| 移动端最终 DOM | PASS | 首页、目录、12 工具、分数聚合、分数模板、博客共 17 页；390×844，无横向溢出，语言/标题/canonical 正确 |
| 真实交互 | PASS | 英寸转换输入 `5 3/4` 得到 `5.75`；目录搜索和清空正常。输入及搜索已恢复 |
| 浏览器控制台 | PASS | 抽查转换器、目录及博客无 error/warn |
| IndexNow | PASS（dry-run） | 解析 134 个 URL，只预览，没有网络提交 |
| 线上性能、索引、排名和流量 | BLOCKED | 本次未部署，未取得线上实测或 Search Console/CrUX 数据；不能据此推断增长 |
| Git diff | BLOCKED | 下载目录没有 `.git`；使用修改前源码快照对照并复核最终源码/DOM，没有创建 commit |

生产浏览器检查还发现并修复了两个冷请求问题：博客分页缺少固定英语上下文导致 500；框架首次渲染的永久跳转产生重复 Location。分页首条改由路由配置重定向；分数别名在 Proxy 中复用页面的解析和白名单逻辑提前重定向，计算逻辑及白名单未变。

### 本地移动端性能样本

本地生产服务、390×844、无网络/CPU 限速、单次导航的 PerformanceObserver 样本。仅作为本地回归证据，不是线上 Core Web Vitals 或 Lighthouse 分数。

| 页面 | TTFB | LCP | CLS |
| --- | ---: | ---: | ---: |
| 首页 | 19.8 ms | 144 ms | 0 |
| 工具目录 | 57.6 ms | 128 ms | 0 |
| 英寸转换器 | 16.3 ms | 76 ms | 0 |

## 证据文件

- [逐页审计 CSV](./local-audit.csv)、[完整审计 JSON](./local-audit.json)
- [路由和图片验证](./routes-and-images.json)、[17 页浏览器 DOM 与性能样本](./browser-checks.json)
- [转换器移动端截图](./evidence/converter-mobile.png)、[目录桌面截图](./evidence/tools-desktop.png)
- `evidence/` 下保留测试、构建、类型检查、lint 和 dry-run 的日志摘要。

## 主要修改位置

| 范围 | 文件 |
| --- | --- |
| 公共 SEO 与结构化数据 | `lib/seo.ts`、`components/SiteSchema.tsx`、`components/PageSchema.tsx`、12 个工具布局 |
| 分享图 | `lib/seo-image.tsx`、`app/og/[slug]/route.tsx`、`data/siteMetadata.js` |
| 地址、日期、抓取 | `app/sitemap.ts`、`app/tool-content-dates.ts`、`app/robots.ts`、`proxy.ts`、`next.config.js` |
| 分数别名 | `lib/fraction-page-route.ts`、`app/[locale]/tools/as-a-decimal/[slug]/page.tsx` |
| 博客与标签 | `lib/blog-seo.ts`、`contentlayer.config.ts`、`app/blog/`、`app/tags/`、`components/Tag.tsx`、`layouts/ListLayoutWithTags.tsx` |
| 定位和内部链接 | `components/RelatedTools.tsx`、`data/tool-topics.ts`、`messages/en.json`、About、作者信息、`public/llms.txt` |
| 审计与测试 | `scripts/seo-audit*.mjs`、`tests/seo/`、`package.json` |
| 构建解析 | `tsconfig.json` 增加 baseUrl，修复已有 `app/seo` 和 `css/*` 裸路径导入 |

原有广告开关、统计账号、工具计算逻辑未变。没有新增工具、语言或批量文章；没有部署、搜索引擎提交或 Git commit。

## 复验方式

```sh
yarn build
yarn serve --hostname localhost -p 3011
# 在另一个终端运行：
yarn seo:audit --site http://localhost:3011 --output reports/seo/local-audit.csv
node --test tests/seo/*.test.mjs tests/drill-reference/*.test.mjs
SEO_TEST_SITE=http://localhost:3011 node --test tests/seo/routes.integration.mjs
yarn tsc --noEmit --incremental false
yarn eslint app components lib layouts scripts proxy.ts
node scripts/submit-indexnow.mjs --dry-run --sitemap .next/server/app/sitemap.xml.body
```

审计器默认将本地页面与 `https://decimaltools.com` 的 canonical 比较；可用 `--canonical-origin` 指定其他预期来源。退出码 1 表示失败、2 表示阻塞。项目现有 `yarn lint` 带自动修复，因此验收使用上面的只读检查方式。

## 参考与限制

采用项目 `ai-seo-optimization` skill 和 Geekskai 的 `lib/seo.ts`、分享图生成及 sitemap 质量检查思路。仅迁移适合单语言 DecimalTools 的部分；没有复制多语言、尾斜杠、SearchAction 或虚构评价/用户量。用户最新 FAQ 要求优先于 skill 中的 FAQ schema 建议。

固定语言上下文的实现参考 [next-intl 配置说明](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/configuration.mdx)。FAQ 和 llms.txt 均不作为排名收益验收依据。
