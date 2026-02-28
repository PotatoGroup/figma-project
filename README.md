# Figma Project

基于 Figma API 的 Monorepo 项目，提供设计稿数据提取、图片处理、API 封装与 MCP 工具能力，可用于设计稿解析、资产导出、Figma 到 React 组件转换及前端协作等场景。

## 技术栈

- **包管理**: pnpm + workspace
- **构建**: [Turborepo](https://turbo.build/) + [Father](https://github.com/umijs/father)
- **语言**: TypeScript

## 项目结构

```
figma-project/
├── packages/
│   ├── extractors/   # 设计数据提取与图片处理（@figma-project/extractors）
│   ├── service/      # Figma REST API 封装（@figma-project/service）
│   ├── mcp/          # MCP 服务（ant-figma-mcp）
│   └── skill/        # 设计稿转代码技能与参考（implement-design）
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 能力概览

| 包名 | 能力说明 |
|------|----------|
| **@figma-project/extractors** | **数据提取**：从 Figma 原始节点提取布局（layout）、文本与样式（text/textStyle）、视觉（fills/strokes/effects/opacity/borderRadius）、组件实例（componentId/componentProperties）；`simplifyRawFigmaObject` 统一简化整文件/节点树，支持 `layoutAndText`、`allExtractors` 等组合；`extractFromDesign` 对原始节点数组做遍历提取。<br>**图片**：基于 sharp 的裁剪与尺寸处理、Figma 变换矩阵裁剪（`downloadAndProcessImage`、`applyCropTransform`）；`parseFigmaUrl` 解析 Figma URL；`smartExtractImageNodes` 从设计数据中智能识别并提取图片节点。 |
| **@figma-project/service** | 封装 Figma REST API：`getRawFile` / `getRawNodes` 获取文件或节点原始 JSON；`getImageFillUrls` 图片填充 URL 映射；`getNodeRenderUrls` 节点渲染图 URL（PNG/SVG，支持 scale 与 SVG 选项）；`getImages` 按 nodeId/imageRef 列表下载图片到本地并调用 extractors 做裁剪与尺寸处理。另导出 `fetchFigmaNodes`、`fetchFigmaAssets` 供上层使用。 |
| **ant-figma-mcp** | MCP 服务，提供工具 **FigmaSmartWorkflow**：传入 Figma URL 后自动完成「解析 URL → 拉取设计数据 → 下载图片资源 → 生成 React 组件规则」的一站式工作流；支持可选参数 componentName、outputPath、imageOutputPath、includeImages、depth、json。需配置 `FIGMA_API_KEY`（或 `--figma-api-key`）。 |
| **implement-design** | 设计稿转代码 Skill，提供流程说明与实现规则（SKILL.md）、Ant Design 组件映射参考（reference/antd.csv）、Figma MCP 配置脚本与故障排查文档，供 Cursor 等场景实现「Figma 链接/选区 → 1:1 React 组件」时使用。 |

## 环境要求

- **Node.js** ≥ 20（见根目录 `package.json` 的 `engines`）
- **pnpm** ≥ 10（根目录 `packageManager`: `pnpm@10.13.1`）

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

const service = new FigmaService(process.env.FIGMA_API_KEY!);

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

// 从 Figma API 响应得到统一设计结构（含 nodes、components、globalVars）
const simplified = simplifyRawFigmaObject(rawFigmaResponse, allExtractors, { maxDepth: 10 });

// 若只有原始节点数组，可直接用 extractFromDesign
const rawNodes = rawFigmaResponse.document.children;
const { nodes } = extractFromDesign(rawNodes, layoutAndText, { maxDepth: 10 });
```

### 使用 MCP 服务（ant-figma-mcp）

在 Cursor 等支持 MCP 的 IDE 中配置 **ant-figma-mcp** 后，可使用工具 **FigmaSmartWorkflow**：

| 工具 | 说明 |
|------|------|
| **FigmaSmartWorkflow** | 传入 Figma 设计链接，自动完成「解析 URL → 拉取设计数据 → 下载图片 → 生成 React 组件规则」全流程；可配 componentName、outputPath、imageOutputPath、includeImages、depth、json 等参数。 |

运行前需提供 Figma API Key：命令行 `--figma-api-key=YOUR_TOKEN`，或环境变量 `FIGMA_API_KEY`，或 `.env` 中配置。

## 依赖关系

```
extractors     (无内部 workspace 依赖)
    ↑
service        (依赖 extractors)
    ↑
mcp            (依赖 extractors、service)
skill          (implement-design，无内部 workspace 依赖)
```

## 更多文档

- [extractors 使用说明](packages/extractors/README.md)
- [service API 说明](packages/service/README.md)
- [MCP 配置与工具说明](packages/mcp/README.md)
- [skill 设计稿转代码技能与参考](packages/skill/README.md)

## 许可证

MIT
