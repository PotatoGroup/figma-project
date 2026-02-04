# Figma Project

基于 Figma API 的 Monorepo 项目，提供设计稿数据提取、图片处理与 API 封装能力，可用于设计稿解析、资产导出与前端协作等场景。

## 技术栈

- **包管理**: pnpm + workspace
- **构建**: [Turborepo](https://turbo.build/) + [Father](https://github.com/umijs/father)
- **语言**: TypeScript

## 仓库结构

```
figma-project/
├── packages/
│   ├── extractors/   # 设计稿数据提取器
│   ├── service/      # Figma API 服务封装
│   ├── mcp/          # MCP 服务（预留）
│   └── skill/        # Skill 能力包（预留）
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### 子包说明

| 包名 | 说明 |
|------|------|
| `@figma-project/extractors` | 从 Figma 原始节点中提取布局、文本、视觉、组件等结构化数据，支持图片裁剪与尺寸处理 |
| `@figma-project/service` | 封装 Figma REST API（文件/节点/图片/SVG），依赖 extractors 做图片下载与处理 |
| `ant-frontend-mcp` | 前端 MCP 服务（当前为占位） |
| `ant-frontend-skill` | 前端 Skill 能力包（当前为占位） |

## 环境要求

- Node.js（建议 18+）
- pnpm 10.x（见根目录 `packageManager`）

## 快速开始

### 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

### 构建

构建所有子包（会按依赖顺序先构建 extractors，再构建 service 等）：

```bash
pnpm build
```

### 开发

启动所有子包的开发模式（watch + 声明文件生成）。dev 会先执行依赖的 `build`，再启动监听：

```bash
pnpm dev
```

### 其他脚本

```bash
pnpm clean          # 清理各包构建产物
pnpm build:graph    # 构建并输出任务依赖图 graph.png
pnpm release        # 以 release 模式发布各包（pnpm publish -r）
```

## 使用示例

### 使用 Service 调用 Figma API

```ts
import { FigmaService } from '@figma-project/service';

const service = new FigmaService(process.env.FIGMA_ACCESS_TOKEN!);

// 获取文件原始 JSON
const file = await service.getRawFile('your-file-key');

// 获取节点渲染图（PNG/SVG）URL
const urls = await service.getNodeRenderUrls('file-key', ['node-id'], 'png', { pngScale: 2 });
```

### 使用 Extractors 提取设计数据

```ts
import {
  extractFromDesign,
  simplifyRawFigmaObject,
  layoutAndText,
  allExtractors,
} from '@figma-project/extractors';

// 将 Figma 原始对象简化为统一节点结构
const simplified = simplifyRawFigmaObject(rawFigmaFile);

// 按需使用内置 extractor 组合提取布局、文本等
const result = extractFromDesign(simplified, { extractors: layoutAndText });
// 或使用全部提取器
const full = extractFromDesign(simplified, { extractors: allExtractors });
```

## 依赖关系

- `service` 依赖 `extractors`（workspace 协议 `workspace:*`）
- `mcp`、`skill` 当前无内部依赖

## 许可证

MIT
