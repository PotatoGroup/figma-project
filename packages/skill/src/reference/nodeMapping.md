# Ant Frontend – Matching & Code Gen Reference

组件说明文档位于 `ant-frontend/references/`，由 `scripts/build-references.mjs` 从 `ant-design/components/<name>/index.zh-CN.md`（或 en-US）整理为 `references/<ComponentName>.md`。生成代码时在此目录中查找对应组件的 API 与示例。

## YAML design structure (from Figma)

- **metadata**: `name`, `lastModified`, `thumbnailUrl`
- **nodes**: tree of nodes. Each node:
  - `id`, `name`, `type` (e.g. FRAME, TEXT, RECTANGLE, INSTANCE)
  - `text` (for TEXT nodes)
  - `layout` (ref into globalVars or inline: mode row/column, gap, alignment)
  - `children` (nested nodes)
  - `fills`, `strokes`, `componentId` (for instances)
- **globalVars.styles**: shared layout/fill/style refs by id

## Node type → Ant Design mapping

| Figma type / pattern | Ant Design component | Reference |
|----------------------|------------------------|-----------|
| Button-like name/role | Button | references/Button.md |
| Text input, search | Input, Input.Search | references/Input.md |
| Single-select dropdown | Select | references/Select.md |
| Date / time | DatePicker, TimePicker | references/DatePicker.md, TimePicker.md |
| List / table | List, Table | references/List.md, Table.md |
| Card / content block | Card | references/Card.md |
| Tabs | Tabs | references/Tabs.md |
| Modal / dialog | Modal | references/Modal.md |
| Side panel | Drawer | references/Drawer.md |
| Horizontal/vertical stack | Space, Flex | references/Space.md, Flex.md |
| Page layout (header/side/content) | Layout | references/Layout.md |
| Icon + label | Button with icon, or Space | references/Button.md |
| Form group | Form, Form.Item | references/Form.md |
| Badge / tag | Badge, Tag | references/Badge.md, Tag.md |

## Code generation tips

1. **Imports**: `import { Button, Input, ... } from 'antd';` (and `Flex` from `antd'` if used).
2. **Layout**: Prefer `Space`, `Flex`, `Grid` to match Figma auto-layout; use `gap`, `align`, `justify` from YAML layout.
3. **Props**: Always check the API table in `references/<Component>.md` for prop names and types.
4. **Images**: If images were downloaded (Step 1), reference them by path (e.g. `./assets/icon.svg`) in `src` or `icon`.
5. **One component per screen**: Export a single function component per main frame; compose smaller pieces inside.
