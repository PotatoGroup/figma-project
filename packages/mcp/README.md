# ant-frontend-mcp

[![NPM version](https://img.shields.io/npm/v/ant-frontend-mcp.svg?style=flat)](https://npmjs.com/package/ant-frontend-mcp)
[![NPM downloads](http://img.shields.io/npm/dm/ant-frontend-mcp.svg?style=flat)](https://npmjs.com/package/ant-frontend-mcp)

基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的 Figma 能力服务，为 Cursor 等支持 MCP 的 IDE 提供 Figma 设计数据获取与「设计 → React 组件」的一站式工作流工具。

## 功能概览

- **FigmaSmartWorkflow**：一条龙工作流——解析 Figma URL → 拉取设计数据 → 自动识别并下载图片 → 生成 React 组件代码规则（推荐入口）
- 内部复用「获取数据、下载图片、生成组件提示」等能力，对外仅暴露一个智能工作流工具，便于在对话中通过 Figma 链接完成从设计到代码的流程

## 环境要求

- Node.js 18+
- 配置 **Figma Access Token**：环境变量 `FIGMA_ACCESS_TOKEN` 或项目根目录 `.env` 中的 `FIGMA_ACCESS_TOKEN`（[Figma 账号 → Personal access token](https://www.figma.com/developers/api#access-tokens)）

## 安装与构建

```bash
pnpm install
pnpm run build
```

构建会编译 TS 并拷贝 `src/prompts` 到产物目录。

## 使用方式（MCP 客户端）

在 Cursor 等 IDE 的 MCP 配置中接入本服务（stdio 传输），即可在对话中调用工具。

### 工具说明

| 工具名                 | 说明                                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FigmaSmartWorkflow** | 传入 Figma 设计链接，自动完成：解析 URL → 获取设计数据（YAML/JSON）→ 可选下载图片到指定目录 → 生成 React 组件代码规则；可配 componentName、outputPath、imageOutputPath、includeImages、depth、json 等 |

### 调用示例（由 IDE 发起）

- 输入：Figma 设计 URL（支持 `file` / `design` 链接格式）
- 可选参数：组件名、输出路径、图片路径、是否包含图片、节点深度、是否输出 JSON 等
- 输出：设计数据（默认 YAML）+ 若启用则包含图片下载结果与 React 组件生成指引

## 依赖

- `@figma-project/extractors`、`@figma-project/service`：设计数据与 Figma API
- `@modelcontextprotocol/sdk`：MCP 服务端
- `zod`、`js-yaml`、`dotenv` 等

## 脚本

```bash
pnpm run dev    # 开发模式
pnpm run build  # 构建（含 prompts 拷贝）
```

## License

MIT
