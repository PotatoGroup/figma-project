---
name: figma-smart-workflow
description: A complete workflow that automatically retrieves design data, downloads image resources, and generates React component code based on the Figma URL entered by the user (preferred).
---

# Ant Frontend (Figma → Ant Design React)

根据用户提供的 Figma 地址获取设计数据并处理成 YAML，结合 `reference/xxx.csv` 文件中关于组件的描述，匹配合适的组件并用 React 代码还原 UI 的流程。

## Workflow（四步）

1. **获取 Figma 数据**：用 Figma REST API 获取节点与图片资源，在 skill 脚本中做必要数据处理，输出 YAML 至 `_assets_/figmaNodes.yaml`，图片等资源下载到 `_assets_/`。
2. **匹配组件**：根据 YAML 数据结构在 `reference/` 中匹配合适组件（如 `reference/antd.csv`、`reference/nodeMapping.md`）。
3. **生成代码**：基于 React 与 Ant Design，利用匹配到的组件完整还原 UI 设计；图片使用 `_assets_/` 中的路径。
4. **清除临时文件**：大模型回答完成后，**调用方**需调用 Step 1 返回的 `cleanup()`，删除 `_assets_/` 目录及其中所有临时文件；若未调用，`_assets_/` 会一直保留。

---

## Step 1: 获取 Figma 设计数据

**输入**：Figma URL（如 `https://www.figma.com/design/ABC123/MyFile?node-id=1:2`）。  
**输出**：`_assets_/figmaNodes.yaml`（YAML 设计数据）+ `_assets_/` 下的图片等资源。  
**环境**：需在 skill 根目录或项目运行根目录的 `.env` 中配置 `FIGMA_API_KEY`（[Figma 账号 → Personal access token](https://www.figma.com/developers/api#access-tokens)）。

### 本 skill 脚本（workflow）

通过 skill 的 `scripts/index.js` 完成 Step 1：

- 解析 URL 得到 `fileKey`、`nodeId`（见下方 URL 解析规则）。
- 使用 `FIGMA_API_KEY` 创建 `FigmaService`，调用 `fetchFigmaNodes` 获取节点数据，写入 `_assets_/figmaNodes.yaml`。
- 使用 `smartExtractImageNodes` 从 YAML 中提取需要下载的图片节点，再调用 `fetchFigmaAssets` 将图片下载到 `_assets_/`。
- 返回 `{ assetsPath: "_assets_ 的绝对路径", cleanup }`；**调用方需在流程结束后调用 `cleanup()` 清除临时文件**（见 Step 4）。

URL 解析规则：

- 路径：`/(file|design)/([a-zA-Z0-9]+)/...` → `fileKey` 为第二段。
- 查询：`node-id=...` → 解码（如 `1%3A2` → `1:2`）为 `nodeId`。

### 可选：Figma MCP（若已配置 figma-ant-mcp）

- **get_figma_data**：传入 `fileKey`、可选 `nodeId`，得到简化后的设计 YAML（nodes + metadata + globalVars）。
- **get_figma_images**：传入 `fileKey`、`nodes`（含 nodeId/fileName 或 imageRef）、`localPath`（如 `./assets`），下载资源；生成代码时使用返回路径。

---

## Step 2: 匹配组件

在 **reference** 中寻找合适组件：

- 查阅 `reference/antd.csv` 等组件表：组件名称、功能描述与使用场景（如 Button、Input、Space、Flex）。
- 根据节点 `name`、`type`、层级结构选组件（如 FRAME + 横向布局 + 多子节点 → `Space` 或 `Flex`）。
- 根据 Figma 节点类型与语义映射到 Ant Design 组件，见 [reference/nodeMapping.md](reference/nodeMapping.md)。

---

## Step 3: 生成代码

1. **读取 YAML**：从 `_assets_/figmaNodes.yaml` 读取，包含 `metadata`、`nodes`（树形：`id`、`name`、`type`、`text`、`layout`、`fills`、`children` 等）及可选的 `globalVars`。
2. **用 React 组件还原 UI**：
   - 每个主 frame/页面导出一个 React 函数组件。
   - 从 `antd` 按 reference 中的 API 引入组件，props 与文档一致。
   - Step 1 下载的图片在代码中使用 `_assets_/` 下对应路径（如 `src="./_assets_/xx.png"` 或项目约定的引入方式）。
3. **布局**：优先用 Ant Design 的 `Flex`、`Space`、`Grid`、`Layout` 等还原 YAML 中的 `layout`（mode、gap、alignment）；仅在需要时用 `style` 或布局 props 映射 `absoluteBoundingBox` 或简化后的 layout。

---

## Step 4: 清除临时文件

**重要**：`_assets_/` 不会自动删除，需由调用方主动清理。

- 在回答/生成流程结束后，调用 Step 1 返回的 **`cleanup()`**，删除 skill 根目录下的 **`_assets_/`** 目录及其中的全部临时文件（含 `figmaNodes.yaml` 与下载的图片）。
- 若 skill 以 CLI 方式单独运行（`node scripts/index.js <Figma URL>`），脚本结束时会输出 `assetsPath`，但**不会**自动调用 `cleanup()`，需调用方或用户自行删除 `_assets_/`。
- 若通过 MCP/Agent 等集成使用，应在「大模型回答完成、代码生成结束」时调用 `cleanup()`，或在适当的生命周期钩子中执行清理。
- 若未使用本 skill 的 Step 1，则需自行删除所使用的临时资源目录。
