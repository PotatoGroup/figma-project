# implement-design

前端协作 Skill 包：将 Figma 设计稿转化为可上线代码，支持 1:1 视觉还原。当用户提供 Figma 链接、说「实现设计」「根据设计稿生成代码」或需要按 Figma 规范实现组件时，可配合 Figma MCP 按本 skill 的流程完成从设计到 Ant Design React 组件的实现。

## 功能概览

- **流程文档**：`SKILL.md` 描述完整工作流（获取 Node ID → 拉取设计上下文 → 截图参考 → 下载资源 → 按项目规范转码 → 1:1 视觉校验），以及如何通过 Figma MCP 工具（`get_design_context`、`get_screenshot`、资源端点等）获取数据与资源。
- **参考资源**：`reference/` 下提供组件映射与规范（如 `nodeMapping.md`、`antd.csv`），用于将设计节点匹配到项目设计系统或 Ant Design 组件。
- **可执行脚本**：如 `scripts/setup-figma-mcp.js`，用于在 Figma MCP 不可用时自动配置 MCP（桌面版或 Remote OAuth），便于继续走实现流程。

## 前置条件（见 SKILL.md）

- **Figma MCP 服务**：需已连接且可用。若不可用，可从项目根目录执行：
  - `node .cursor/skills/implement-design/scripts/setup-figma-mcp.js`（默认桌面 MCP）
  - `node .cursor/skills/implement-design/scripts/setup-figma-mcp.js --remote`（Remote OAuth）
- 用户提供 Figma URL（格式：`https://figma.com/design/:fileKey/:fileName?node-id=1-2`），或使用 `figma-desktop` MCP 时在桌面端选中节点即可。

## 目录与构建产物

构建脚本将 `src/` 整体拷贝到输出目录并打 zip，不进行 esbuild 等编译。

| 来源             | 说明                                       |
| ---------------- | ------------------------------------------ |
| `src/SKILL.md`   | 流程说明与实现规则，拷贝到输出目录根目录     |
| `src/reference/` | 组件参考与映射（如 antd.csv、nodeMapping.md） |
| `src/scripts/`   | 脚本（如 setup-figma-mcp.js），原样拷贝     |
| `src/.env`       | 环境变量（如 Figma 相关配置），拷贝到输出目录（勿提交敏感内容） |

构建完成后生成 `implement-design/` 目录与 `implement-design.zip`，解压即可放入 Cursor skills 等宿主使用。

## 安装与构建

在 **monorepo 根目录**执行：

```bash
pnpm install
pnpm run build
```

或在当前包下：

```bash
pnpm run build
```

构建后：

- `packages/skill/implement-design/`：完整 skill 目录（SKILL.md、reference、scripts、.env 等）
- `implement-design.zip`：上述目录的压缩包，便于分发或配置到 Cursor skills

## 使用场景

1. **AI 协作**：将解压后的 `implement-design` 配置为 skill，AI 按 `SKILL.md` 的步骤执行（解析 URL/选区 → 调 MCP 取设计上下文与截图 → 下载资源 → 按 reference 与项目规范生成代码 → 对照截图做视觉校验）。
2. **配置 Figma MCP**：在宿主编译或拷贝好 skill 后，若 Figma MCP 未就绪，可执行 `node implement-design/scripts/setup-figma-mcp.js`（或加 `--remote`）完成配置后再走实现流程。

## 依赖说明

- **构建期**：仅需 Node 与 `fs`/`path` 等内置模块；构建脚本只做目录拷贝与 zip，无 esbuild 等编译依赖。
- **运行期（skill 内脚本）**：脚本若需 Figma API 或环境变量，由调用方保证（如 `.env` 或 Cursor 环境）；Figma 数据与资源通过 MCP 获取，不依赖本仓库的 node_modules。

## 脚本

```bash
pnpm run dev    # 开发模式
pnpm run build  # 构建：clean → 拷贝 src 到 implement-design → 打 zip
pnpm run clean  # 删除构建输出目录
```

## License

MIT
