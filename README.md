# Figma Project

基于 Figma API 的 Monorepo 项目，提供设计稿数据提取、图片处理、API 封装与 MCP 工具能力，可用于设计稿解析、资产导出、Figma 到 React 组件转换及前端协作等场景。

## 技术栈

- **包管理**: pnpm + workspace
- **构建**: [Turborepo](https://turbo.build/) + [Father](https://github.com/umijs/father)
- **语言**: TypeScript

## 能力概览

| 包名                          | 能力说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@figma-project/extractors** | 从 Figma 原始节点提取结构化数据：布局（layout）、文本与文本样式（text/textStyle）、视觉（fills/strokes/effects/opacity/borderRadius）、组件实例（componentId/componentProperties）；提供 `simplifyRawFigmaObject` 统一简化整文件/节点树，支持按需组合内置 extractor（如 `layoutAndText`、`allExtractors`）。图片相关：基于 sharp 的裁剪与尺寸处理（`downloadAndProcessImage`）、Figma 变换矩阵裁剪；Figma URL 解析（`parseFigmaUrl`）；从设计数据中智能识别并提取图片节点（`smartExtractImageNodes`）。 |
| **@figma-project/service**    | 封装 Figma REST API：`getRawFile` / `getRawNodes` 获取文件或节点原始 JSON；`getImageFillUrls` 获取图片填充 URL 映射；`getNodeRenderUrls` 获取节点渲染图 URL（PNG/SVG，支持 scale 与 svg 选项）；`getImages` 按配置下载图片到本地并调用 extractors 进行裁剪与尺寸处理，支持 imageRef 与 nodeId 两种来源。                                                                                                                                                                                                |
| **ant-frontend-mcp**          | MCP 服务，对外提供四个工具：**get_figma_data**（按 fileKey/nodeId 获取设计数据，输出 YAML 或 JSON）；**get_figma_images**（根据节点列表下载 PNG/SVG 到指定目录，支持裁剪与尺寸信息）；**figma_workflow_orchestrator**（一站式工作流：解析 Figma URL → 拉取数据 → 自动识别并下载图片 → 生成 React 组件代码规则）；**react_component_generator**（基于 Figma 数据与图片信息生成 React + Ant Design 组件代码的提示与规范）。需配置 `FIGMA_ACCESS_TOKEN`。                                                  |
| **ant-frontend-skill**        | 占位包，暂无业务实现。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

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

// 从 Figma API 响应得到统一设计结构（含 nodes、components、globalVars）
const simplified = simplifyRawFigmaObject(rawFigmaResponse, allExtractors, { maxDepth: 10 });

// 若只有原始节点数组，可直接用 extractFromDesign
const rawNodes = rawFigmaResponse.document.children;
const { nodes } = extractFromDesign(rawNodes, layoutAndText, { maxDepth: 10 });
```

### 使用 MCP 服务（ant-frontend-mcp）

在 Cursor 等支持 MCP 的 IDE 中配置 `ant-frontend-mcp` 后，可通过工具调用：

- **figma_workflow_orchestrator**：传入 Figma 设计链接，自动完成「取数 → 下载图片 → 生成 React 组件规则」全流程（推荐）。
- **get_figma_data**：仅拉取设计数据（fileKey、可选 nodeId、depth），输出 YAML/JSON。
- **get_figma_images**：按节点列表将 PNG/SVG 下载到指定 `localPath`。
- **react_component_generator**：传入已有 Figma 数据与图片信息，获取用于生成 React + Ant Design 组件的提示与规范。

需在运行环境中设置 `FIGMA_ACCESS_TOKEN`（或在 `.env` 中配置）。

## 依赖关系

- `service` 依赖 `extractors`（workspace 协议 `workspace:*`）
- `mcp` 依赖 `extractors`、`service`
- `skill` 当前无内部依赖

## 许可证

MIT
