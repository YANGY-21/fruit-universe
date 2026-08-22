# 水果星球 Fruit Planet

把"水果人格测试"做成一个 Next.js 全栈作品集项目。测测你是哪种水果，还能和 AI 考官聊聊，让它用几个问题锁定你的水果人格。

线上地址（腾讯云 EdgeOne，国内可直连）：待部署后填入
国际版（Vercel，国内网络不可达）：https://fruit-universe.vercel.app

## 功能

- **经典测试**：18 道题随机抽 8 道，加权计分算出你的水果人格（14 种）
- **AI 考官**：和 AI 聊几句，它自适应追问，最终给出诊断 + 完整推理过程
- **为什么是这种水果**：每种人格都有对应的象征解读
- **数据落库**：测试结果存入 Postgres，支持省份维度（为后续"全国水果人格地图"做准备）

## 技术栈

- Next.js 16（App Router + TypeScript）
- DeepSeek API（AI 考官，key 只在服务端）
- Neon Postgres（`@neondatabase/serverless`）

## 本地运行

```bash
npm install
cp .env.example .env.local   # 填入 DEEPSEEK_API_KEY 和 POSTGRES_URL
npm run dev
```

## 部署（腾讯云 EdgeOne Pages）

EdgeOne Pages 是国内可直连的"Vercel 替代"。本仓库是标准 Next.js，零 Vercel 依赖，直接平台导入 GitHub 仓库即可。

1. 控制台 Git 导入 `YANGY-21/fruit-universe`
2. 配两个环境变量（构建时会烘焙进函数）：
   - `DEEPSEEK_API_KEY`（DeepSeek 平台创建）
   - `POSTGRES_URL`（Neon 连接串，国内直连可达）
3. 部署后用 `curl /api/health` 验证

> 注意：环境变量改完要**重新部署**才生效；连接串里不要带换行符。Vercel 版保留不删，作为国际访问备份。

## 目录结构

```
app/
  api/judge/     AI 考官接口（服务端校验 + 日预算）
  api/results/   结果落库接口
  quiz/          经典测试页
  judge/         AI 考官聊天页
  result/        结果页
components/      复用组件（ChatBubble / FruitResult / VisitCounter）
data/            14 种人格数据、题库
lib/             评分算法、AI 状态机、数据库连接
scripts/         init-db.mjs（建表脚本）
```
