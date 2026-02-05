# ant-frontend-skill

[![NPM version](https://img.shields.io/npm/v/ant-frontend-skill.svg?style=flat)](https://npmjs.com/package/ant-frontend-skill)
[![NPM downloads](http://img.shields.io/npm/dm/ant-frontend-skill.svg?style=flat)](https://npmjs.com/package/ant-frontend-skill)

前端协作 Skill 包：提供「Figma 设计 → 数据获取 → 组件匹配 → React 代码生成」的流程说明、参考规范与可执行脚本，供 AI 或开发者按步骤完成从设计稿到 Ant Design React 组件的还原。

## 功能概览

- **流程文档**：`SKILL.md` 描述三步工作流（获取 Figma 数据 → 匹配组件 → 生成代码），以及如何通过本仓库脚本或 MCP 工具获取数据与资源
- **参考资源**：`reference/` 下提供组件映射与规范（如 `nodeMapping.md`、`antd.csv`），用于从设计结构匹配到 Ant Design 组件
- **脚本**：`scripts` 目录经构建打包为 `dist/scripts/index.js`，可与流程配合使用
- **构建产物**：除 scripts 打包外，`src` 下其余文件（如 `SKILL.md`、`reference/`、`.env` 等）会拷贝到 `dist`，便于分发或作为 MCP/Skill 的上下文资源

## 目录与构建产物

| 来源             | 说明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `src/SKILL.md`   | 流程说明文档，拷贝到 `dist/`                                         |
| `src/reference/` | 组件参考与映射，拷贝到 `dist/reference/`                             |
| `src/scripts/`   | 可执行脚本，打包为 `dist/scripts/index.js`                           |
| `src/.env`       | 环境变量（如 `FIGMA_API_KEY`），拷贝到 `dist/`（注意勿提交敏感内容） |

## 安装与构建

```bash
pnpm install
pnpm run build
```

构建后：

- `dist/scripts/index.js`：脚本入口
- `dist/SKILL.md`、`dist/reference/`、`dist/.env` 等：与流程相关的静态资源

## 使用场景

1. **AI 协作**：将 `SKILL.md` 与 `reference/` 作为上下文，按「获取数据 → 匹配组件 → 生成代码」执行
2. **与 MCP 配合**：使用 **ant-frontend-mcp** 的 FigmaSmartWorkflow 获取设计数据与图片后，再结合本包中的 `reference` 做组件匹配与代码生成
3. **本地脚本**：在配置好 `FIGMA_ACCESS_TOKEN` 等环境后，运行 `dist/scripts/index.js` 完成流程中的自动化步骤（若脚本已实现）

## 依赖

仅构建期依赖（如 `father`、`copy-webpack-plugin`），无对外运行时依赖。

## 脚本

```bash
pnpm run dev    # 开发模式
pnpm run build  # 构建（scripts 打包 + 其余文件拷贝到 dist）
```

## License

MIT
