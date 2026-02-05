# @figma-project/extractors

[![NPM version](https://img.shields.io/npm/v/@figma-project/extractors.svg?style=flat)](https://npmjs.com/package/@figma-project/extractors)
[![NPM downloads](http://img.shields.io/npm/dm/@figma-project/extractors.svg?style=flat)](https://npmjs.com/package/@figma-project/extractors)

Figma 设计数据提取库，从 Figma REST API 的原始节点中提取结构化数据，支持布局、文本、样式、组件及图片等维度的可插拔提取与统一简化。

## 功能概览

- **节点遍历与提取**：按可配置的 extractor 组合遍历节点树，输出简化后的设计结构
- **设计级简化**：从「文件 / 节点」API 响应得到统一的 `SimplifiedDesign`（含 metadata、nodes、components、globalVars）
- **内置提取器**：布局、文本、视觉（fills/strokes/effects/opacity/borderRadius）、组件实例等
- **图片相关**：Figma URL 解析、从设计数据中智能识别图片节点、基于 sharp 的下载与裁剪/尺寸处理

## 安装

```bash
pnpm add @figma-project/extractors
```

## 依赖

- `@figma/rest-api-spec`：Figma 官方 API 类型
- `remeda`：工具函数
- `sharp`：图片处理（裁剪、尺寸等）

## 核心 API

### 类型

- `ExtractorFn`、`TraversalContext`、`TraversalOptions`、`GlobalVars`、`StyleTypes` 等见 `types`

### 节点级提取

- **`extractFromDesign(rawNodes, extractors, options?, globalVars?)`**  
  对原始节点数组做遍历，使用一组 extractor 得到简化后的 `nodes` 与 `globalVars`。

### 设计级简化

- **`simplifyRawFigmaObject(apiResponse, nodeExtractors, options?)`**  
  接收 `GetFileResponse` 或 `GetFileNodesResponse`，用指定 extractor 组合输出完整的 `SimplifiedDesign`（metadata、nodes、components、componentSets、globalVars）。

### 内置提取器与组合

- **单维**：`layoutExtractor`、`textExtractor`、`visualsExtractor`、`componentExtractor`
- **组合**：`allExtractors`、`layoutAndText`、`contentOnly`、`visualsOnly`、`layoutOnly`

### 工具

- **`parseFigmaUrl(url)`**  
  解析 Figma file/design URL，返回 `fileKey`、`nodeId`、`fileName`、`isValid` 等（见 `FigmaUrlInfo`）。
- **`smartExtractImageNodes(figmaDataText)`**  
  从 YAML/JSON 格式的设计数据中识别并提取需要下载的图片节点（nodeId、fileName、imageRef、裁剪与尺寸信息等）。
- **图片处理**（`utils/image-processing`）：`downloadAndProcessImage` 等，支持按 Figma 变换矩阵裁剪与尺寸处理。

## 使用示例

```ts
import {
  simplifyRawFigmaObject,
  allExtractors,
  parseFigmaUrl,
  smartExtractImageNodes,
} from "@figma-project/extractors";

// 从 API 响应得到统一设计结构
const simplified = simplifyRawFigmaObject(rawFigmaResponse, allExtractors, {
  maxDepth: 10,
});

// 解析 Figma 链接
const urlInfo = parseFigmaUrl(
  "https://www.figma.com/design/ABC123/MyFile?node-id=1:2"
);
// urlInfo.fileKey, urlInfo.nodeId, urlInfo.isValid

// 从设计数据中提取图片节点（用于下载）
const yamlOrJson = JSON.stringify(simplified);
const imageNodes = smartExtractImageNodes(yamlOrJson);
```

## 脚本

```bash
pnpm run dev    # 开发模式（watch + 类型）
pnpm run build  # 构建
```

## License

MIT
