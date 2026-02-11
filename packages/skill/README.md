# ant-figma-skill

[![NPM version](https://img.shields.io/npm/v/ant-figma-skill.svg?style=flat)](https://npmjs.com/package/ant-figma-skill)
[![NPM downloads](http://img.shields.io/npm/dm/ant-figma-skill.svg?style=flat)](https://npmjs.com/package/ant-figma-skill)

前端协作 Skill 包：提供「Figma 设计 → 数据获取 → 组件匹配 → React 代码生成」的流程说明、参考规范与可执行脚本，供 AI 或开发者按步骤完成从设计稿到 Ant Design React 组件的还原。

## 技术架构（AI 调用时不依赖宿主环境）

- **自包含产物**：构建阶段使用 **esbuild** 将 `src/scripts` 与所有运行时依赖（`@figma-project/service`、`@figma-project/extractors`、`dotenv` 等）打成**单文件** `ant-figma-skill/scripts/index.js`。
- **运行时不依赖宿主**：AI 或宿主环境调用该 skill 时，只需 **Node.js**，无需安装本仓库或宿主的 `node_modules`；脚本内已内联所需逻辑，仅依赖 Node 内置模块（如 `path`、`fs`）及网络（Figma API）。
- **构建期依赖**：仅在 monorepo 内执行 `pnpm build` 时需要 `esbuild`、`@figma-project/service`、`@figma-project/extractors` 等；这些依赖不会随 skill 分发，也不会在调用方环境使用。

## 功能概览

- **流程文档**：`SKILL.md` 描述工作流（获取 Figma 数据 → 匹配组件 → 生成代码），以及如何通过本 skill 脚本或 MCP 工具获取数据与资源
- **参考资源**：`reference/` 下提供组件映射与规范（如 `nodeMapping.md`、`antd.csv`）
- **可执行脚本**：构建后为 `ant-figma-skill/scripts/index.js`（单文件、自包含），可与流程配合使用

## 目录与构建产物

| 来源             | 说明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `src/SKILL.md`   | 流程说明文档，拷贝到 `ant-figma-skill/`                               |
| `src/reference/` | 组件参考与映射，拷贝到 `ant-figma-skill/reference/`                  |
| `src/scripts/`   | 入口与工作流，经 esbuild 打包为单文件 `ant-figma-skill/scripts/index.js` |
| `src/.env`       | 环境变量（如 `FIGMA_API_KEY`），拷贝到 `ant-figma-skill/`（勿提交敏感内容） |

构建完成后会生成 `ant-figma-skill.zip`，解压即得上述目录结构，可直接放入 Cursor skills 等宿主使用。

## 安装与构建

在** monorepo 根目录**执行：

```bash
pnpm install
pnpm run build
```

或在当前包下：

```bash
pnpm run build
```

构建后：

- `packages/skill/ant-figma-skill/scripts/index.js`：自包含脚本入口（不依赖宿主 node_modules）
- `ant-figma-skill/SKILL.md`、`reference/`、`.env` 等：静态资源
- `ant-figma-skill.zip`：完整 skill 压缩包，便于分发

## 使用场景

1. **AI 协作**：将解压后的 `ant-figma-skill` 配置为 skill，AI 按 `SKILL.md` 执行流程；执行 `node scripts/index.js <Figma URL>` 时仅需 Node.js 与 `FIGMA_API_KEY`，无需宿主安装本仓库依赖。
2. **本地脚本**：在配置好 `.env` 或环境变量后，运行 `node ant-figma-skill/scripts/index.js "https://figma.com/design/..."` 获取设计数据与资源。

## 依赖说明

- **构建期**：`esbuild`、`rimraf`、`@figma-project/service`、`@figma-project/extractors`、`dotenv` 等（仅用于打包与开发）。
- **运行期（产物）**：单文件 bundle，仅需 Node.js；**sharp** 为可选：未安装时仍可下载图片，但不做裁剪与尺寸处理；安装 `sharp` 后可获得完整图片处理能力。

## 脚本

```bash
pnpm run dev    # 开发模式
pnpm run build  # 构建：clean → esbuild 单文件 bundle → 拷贝非 scripts → zip
pnpm run clean  # 删除 ant-figma-skill/
```

## License

MIT
