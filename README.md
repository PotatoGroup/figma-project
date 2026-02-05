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
│   ├── extractors/   # 设计数据提取与图片处理
│   ├── service/      # Figma REST API 封装
│   ├── mcp/          # MCP 服务（ant-figma-mcp）
│   └── skill/        # 技能与参考（@figma-project/skill）
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 能力概览

| 包名 | 能力说明 |
|------|----------|
| **@figma-project/extractors** | **数据提取**：从 Figma 原始节点提取布局（layout）、文本与样式（text/textStyle）、视觉（fills/strokes/effects/opacity/borderRadius）、组件实例（componentId/componentProperties）；`simplifyRawFigmaObject` 统一简化整文件/节点树，支持 `layoutAndText`、`allExtractors` 等组合。<br>**图片**：基于 sharp 的裁剪与尺寸处理、Figma 变换矩阵裁剪；`parseFigmaUrl` 解析 Figma URL；`smartExtractImageNodes` 智能识别并提取图片节点。 |
| **@figma-project/service** | 封装 Figma REST API：`getRawFile` / `getRawNodes` 获取文件或节点原始 JSON；`getImageFillUrls` 图片填充 URL 映射；`getNodeRenderUrls` 节点渲染图 URL（PNG/SVG，支持 scale）；`getImages` 下载图片到本地并调用 extractors 做裁剪与尺寸处理（支持 imageRef / nodeId）。 |
| **ant-figma-mcp** | MCP 服务，提供四类工具：**get_figma_data**（按 fileKey/nodeId 获取设计数据，输出 YAML/JSON）；**get_figma_images**（按节点列表下载 PNG/SVG 到指定目录）；**figma_workflow_orchestrator**（一站式：解析 URL → 拉取数据 → 下载图片 → 生成 React 组件规则）；**react_component_generator**（基于 Figma 数据与图片生成 React + Ant Design 组件提示与规范）。需配置 `FIGMA_ACCESS_TOKEN`。 |
| **@figma-project/skill** | 技能与参考包，提供 Figma 相关技能说明与参考文档（如 antd 组件映射、节点映射等），供 Cursor 等场景使用。 |

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

### 使用 MCP 服务（ant-figma-mcp）

在 Cursor 等支持 MCP 的 IDE 中配置 **ant-figma-mcp** 后，可通过以下工具调用：

| 工具 | 说明 |
|------|------|
| **figma_workflow_orchestrator** | 传入 Figma 设计链接，自动完成「取数 → 下载图片 → 生成 React 组件规则」全流程（推荐） |
| **get_figma_data** | 按 fileKey（可选 nodeId、depth）拉取设计数据，输出 YAML/JSON |
| **get_figma_images** | 按节点列表将 PNG/SVG 下载到指定 `localPath`，支持裁剪与尺寸信息 |
| **react_component_generator** | 传入 Figma 数据与图片信息，获取生成 React + Ant Design 组件的提示与规范 |

运行前需在环境中设置 `FIGMA_ACCESS_TOKEN`（或在 MCP 包目录下的 `.env` 中配置）。

## 依赖关系

```
extractors     (无内部 workspace 依赖)
    ↑
service        (依赖 extractors)
    ↑
mcp            (依赖 extractors、service)
skill          (无内部 workspace 依赖)
```

## 更多文档

- [extractors 使用说明](packages/extractors/README.md)
- [service API 说明](packages/service/README.md)
- [MCP 配置与工具说明](packages/mcp/README.md)
- [skill 技能与参考](packages/skill/README.md)

## 许可证

MIT
