# Figma 节点与 Reference CSV 组件映射说明

本文档说明如何从 **Figma 设计数据（YAML nodes）** 映射到 **reference 目录下 CSV 组件描述文件** 中的 Ant Design 组件，供匹配与代码生成使用。

---

## Reference 目录与 CSV 结构

- **目录**：`reference/`
- **组件描述文件**：如 `reference/antd.csv`，为当前使用的 Ant Design 组件表。

**CSV 列说明**：

| 列名       | 说明 |
|------------|------|
| 组件英文名 | 对应 antd 组件名，用于 import 与映射查找（如 `Button`、`Input`） |
| 组件中文名 | 组件中文名称 |
| 功能描述   | 组件用途简述 |
| 使用场景   | 何时使用该组件的说明 |
| 分组       | 分类（如：通用、布局、数据录入、数据展示、导航、反馈、其他） |

**匹配逻辑**：根据 Figma 节点的 `type`、`name`、层级与语义，在 CSV 中按「组件英文名」「功能描述」「使用场景」查找最合适的组件行，得到该组件的 API 与用法说明，用于生成代码。

---

## YAML 设计结构（Figma 输出）

Step 1 得到的 YAML 中与匹配相关的结构：

- **metadata**：`name`、`lastModified`、`thumbnailUrl`
- **nodes**：树形节点，每个节点常见字段：
  - `id`、`name`、`type`（如 FRAME、TEXT、RECTANGLE、INSTANCE、COMPONENT）
  - `text`（TEXT 节点）
  - `layout`（row/column、gap、alignment，或引用 globalVars）
  - `children`（子节点）
  - `fills`、`strokes`、`componentId`（实例/组件）
- **globalVars.styles**：共享的 layout/fill 等样式引用

---

## Figma 节点类型 / 模式 → CSV 组件映射表

根据 **Figma 节点 type/name/结构** 推断应使用的 **Ant Design 组件**，再在 **reference/antd.csv** 中按「组件英文名」或「功能描述」定位对应行。

| Figma 类型 / 模式              | 推荐 Ant Design 组件     | 在 CSV 中查找 |
|--------------------------------|---------------------------|---------------|
| 按钮状 name/role、可点击块     | Button                    | 组件英文名 = Button |
| 单行文本输入、搜索框           | Input, Input.Search       | Input |
| 下拉单选                     | Select                    | Select |
| 日期/时间选择                 | DatePicker, TimePicker    | DatePicker, TimePicker |
| 列表/表格                     | List, Table               | List, Table |
| 卡片/内容块                   | Card                      | Card |
| 多 Tab 切换                   | Tabs                      | Tabs |
| 弹窗/对话框                   | Modal                     | Modal |
| 侧边滑出面板                  | Drawer                    | Drawer |
| 水平/垂直自动布局（Auto Layout） | Space, Flex               | Space, Flex |
| 整页布局（header/side/content） | Layout                    | Layout |
| 图标 + 文案、图标按钮         | Button（icon）、Space     | Button |
| 表单项组合                    | Form, Form.Item           | Form |
| 徽标/标签                     | Badge, Tag                | Badge, Tag |
| 分割线                        | Divider                   | Divider |
| 头像                          | Avatar                    | Avatar |
| 图片/插图                     | Image                     | Image |
| 进度指示                      | Progress, Spin            | Progress, Spin |
| 空状态占位                    | Empty                     | Empty |
| 提示气泡（简单文案）          | Tooltip                   | Tooltip |
| 步骤流程                      | Steps                     | Steps |
| 树形结构                      | Tree, TreeSelect          | Tree, TreeSelect |
| 上传                          | Upload                    | Upload |
| 排版文本（标题、段落、列表）   | Typography                | Typography |
| 栅格布局                      | Grid                      | Grid |
| 分段选择                      | Segmented                 | Segmented |

**说明**：

- 同一 Figma 模式可能对应多个候选组件（如 Space / Flex），可结合 CSV 的「使用场景」「功能描述」做最终选择。
- 若节点为 **INSTANCE** 或带 **componentId**，可结合其 `name` 与父级布局推断为按钮、输入框、卡片等，再查 CSV。
- 纯 **FRAME** + 子节点多为布局容器，优先考虑 **Flex**、**Space**、**Layout**、**Grid**，在 CSV 中对应「布局」分组。

---

## 使用方式小结

1. **解析 YAML**：从 `_assets_/figmaNodes.yaml` 读取 `nodes` 树。
2. **按节点匹配**：根据上表由 `type`/`name`/结构得到候选组件英文名。
3. **查 CSV**：在 `reference/antd.csv` 中按「组件英文名」找到该行，参考「功能描述」「使用场景」确认，并依该组件文档生成 props 与用法。
4. **生成代码**：`import { ... } from 'antd'`，按 CSV 对应组件的 API 书写 JSX。
