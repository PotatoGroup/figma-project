---
name: figma-smart-workflow
description: A complete workflow that automatically retrieves design data, downloads image resources, and generates React component code based on the Figma URL entered by the user (preferred).
---

# Ant Frontend (Figma → Ant Design React)

根据用户提供的 Figma 地址获取设计数据并处理成 YAML，结合 `references/`目录下关于组件的描述，匹配合适的组件并用 React 代码还原 UI的流程。

## Workflow（三步）

1. **获取Figma数据**：用 Figma REST API 获取 node 与图片资源，在 skill 脚本中做必要数据处理，输出 YAML 格式设计数据。
2. **匹配组件**：根据YAML数据结构匹配 `references` 中合适的组件。
3. **生成代码**：基于React框架，利用匹配到的组件完整还原 UI 设计。

---

## Step 1: 获取 Figma 设计数据

**输入**：Figma URL（如 `https://www.figma.com/design/ABC123/MyFile?node-id=1:2`）。  
**输出**：YAML 设计数据（含 metadata、nodes 树、globalVars.styles）。处理逻辑参考 `figma-mcp/src/figma/service.ts` 与 design-extractor：拉取 file/nodes、解析为 metadata+rawNodes、遍历节点做 layout/text/fills 等简化后输出。

### 方式 A：本 skill 脚本（不依赖 MCP）

在 **potato** 仓库根目录执行：

```bash
FIGMA_ACCESS_TOKEN="your-token" node ant-frontend/scripts/fetch-figma-yaml.mjs "https://www.figma.com/design/ABC123/FileName?node-id=1:2"
```

- 需要设置 `FIGMA_ACCESS_TOKEN`（[Figma 账号 → Personal access token](https://www.figma.com/developers/api#access-tokens)）。
- 脚本内部：调用 Figma REST API 获取 file 或 nodes → 解析为 metadata + rawNodes → 对节点做 layout/text/fills/strokes/opacity/component 等简化处理 → 输出 `{ metadata, nodes, globalVars }` 的 YAML。
- 结果打印到 stdout，需要时可重定向：`... > design.yaml`。可选第二参数 `depth` 控制遍历深度（默认 10）。

### 方式 B：Figma MCP（若已配置）

若已配置 **figma-ant-mcp**：

1. **get_figma_data**：传入从 URL 解析的 `fileKey`、可选 `nodeId`，得到简化后的设计 YAML（nodes + metadata + globalVars）。
2. **get_figma_images**：设计中有图片/图标时，用 `fileKey`、`nodes`（nodeId + fileName，或 imageRef）、`localPath`（如 `./assets`）下载资源，生成代码时使用返回路径（如 `src="/assets/icon.svg"`）。

URL 解析规则：

- 路径：`/(file|design)/([a-zA-Z0-9]+)/...` → `fileKey` 为第二段。
- 查询：`node-id=...` → 解码（如 `1%3A2` → `1:2`）为 `nodeId`。

---

## Step 2: 匹配组件
 **在 references 中寻找合适组件**：
- 查阅 `references/xxx.csv` 中组件表，每个组件一个一行，包含组件中、英文名称，组件功能描述以及使用场景（如 Button、Input）。
- 根据节点 `name`、`type`、层级结构在 `references/` 里选组件（如 FRAME + 横向布局 + 多子节点 → `Space` 或 `Flex`，见 `references/xxx.csv`组件表）
- 根据 Figma 节点类型与语义映射到组件（见[reference/nodeMapping.md](nodeMapping.md)）。

---

## Step 3: 生成代码

1. **读取 YAML**：包含 `metadata`、`nodes`（树形：`id`、`name`、`type`、`text`、`layout`、`fills`、`children` 等）、以及可选的 `globalVars`。
2. **用 React 组件代码还原 UI 设计**：
   - 每个主 frame/页面导出一个 React 函数组件。
   - 从 `antd` 按 references 中的 API 引入组件，props 与文档中的 API 表一致。
   - 若 Step 1 下载了图片，在代码中使用对应路径（如 `src={require('./assets/xx.png')}` 或项目约定的引入方式）。
3. **布局**：优先用 Ant Design 的 `Flex`、`Space`、`Grid`、`Layout` 等还原 YAML 中的 `layout`（mode、gap、alignment）；仅在需要时用 `style` 或布局 props 映射 `absoluteBoundingBox` 或简化后的 layout。

---
