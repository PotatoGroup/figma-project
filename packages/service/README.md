# @figma-project/service

[![NPM version](https://img.shields.io/npm/v/@figma-project/service.svg?style=flat)](https://npmjs.com/package/@figma-project/service)
[![NPM downloads](http://img.shields.io/npm/dm/@figma-project/service.svg?style=flat)](https://npmjs.com/package/@figma-project/service)

Figma REST API 封装服务，提供文件/节点原始数据获取、图片填充 URL、节点渲染图 URL，以及按配置下载图片到本地并与 extractors 联动处理（裁剪、尺寸等）。

## 功能概览

- **原始数据**：`getRawFile`、`getRawNodes` 获取文件或指定节点的原始 JSON
- **图片 URL**：`getImageFillUrls` 获取图片填充 URL 映射；`getNodeRenderUrls` 获取节点导出图 URL（PNG/SVG，可配 scale 与 SVG 选项）
- **下载与处理**：`getImages` 按节点/ imageRef 列表下载到指定目录，并调用 `@figma-project/extractors` 的 `downloadAndProcessImage` 做裁剪与尺寸处理

## 安装

```bash
pnpm add @figma-project/service
```

## 依赖

- `@figma-project/extractors`（workspace）：设计数据简化与图片处理
- `@figma/rest-api-spec`：Figma API 类型

## 使用方式

使用前需具备 Figma Personal Access Token（[Figma 账号 → Personal access token](https://www.figma.com/developers/api#access-tokens)）。

```ts
import { FigmaService } from "@figma-project/service";

const service = new FigmaService(process.env.FIGMA_ACCESS_TOKEN!);

// 获取文件原始 JSON
const file = await service.getRawFile("your-file-key", 10);

// 获取指定节点的原始数据
const nodes = await service.getRawNodes("file-key", "1:2", 10);

// 获取图片填充 URL 映射（key 为 imageRef）
const fillUrls = await service.getImageFillUrls("file-key");

// 获取节点渲染图 URL（PNG 或 SVG）
const urls = await service.getNodeRenderUrls(
  "file-key",
  ["node-id-1", "node-id-2"],
  "png",
  { pngScale: 2 }
);

// 按配置下载图片到本地并做裁剪/尺寸处理
const results = await service.getImages(
  "file-key",
  "./assets",
  [
    { nodeId: "1:2", fileName: "icon.svg" },
    { imageRef: "abc", fileName: "fill.png", needsCropping: true, cropTransform: [...] },
  ],
  { pngScale: 2 }
);
```

## API 简述

| 方法                                                    | 说明                                   |
| ------------------------------------------------------- | -------------------------------------- |
| `getRawFile(fileKey, depth?)`                           | 获取文件完整 JSON（可选深度）          |
| `getRawNodes(fileKey, nodeId, depth?)`                  | 获取指定节点及其子节点 JSON            |
| `getImageFillUrls(fileKey)`                             | 获取图片填充 URL 映射                  |
| `getNodeRenderUrls(fileKey, nodeIds, format, options?)` | 获取节点导出图 URL（png/svg）          |
| `getImages(fileKey, localPath, items, options?)`        | 按 items 下载图片到 localPath 并做处理 |

`getImages` 的 `items` 支持 `nodeId`（按节点渲染）或 `imageRef`（按图片填充），可选 `needsCropping`、`cropTransform`、`requiresImageDimensions` 等，与 extractors 的图片处理能力一致。

## 脚本

```bash
pnpm run dev    # 开发模式
pnpm run build  # 构建
```

## License

MIT
