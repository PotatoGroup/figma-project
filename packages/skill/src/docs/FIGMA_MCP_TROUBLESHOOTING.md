# Figma MCP 在 Cursor 中配置不成功 - 排查指南

当 Figma MCP 不可用时，Skill 会**持续尝试修改 mcpServers 配置**（如运行 setup 脚本、切换 Desktop/Remote、调整配置格式），直至 MCP 可用或所有方案均失败。

## 一、默认方案：Desktop MCP（本地优先，无需 OAuth）

Skill 检测不到 Figma MCP 时会自动执行配置，**默认优先使用 Desktop MCP（本地）**：

```bash
node .cursor/skills/ant-figma-skill/scripts/setup-figma-mcp.js
```

会配置为 `http://127.0.0.1:3845/mcp`，需 Figma Desktop 应用运行。

**重要**：脚本会同时写入**项目级** `.cursor/mcp.json` 与**全局** `~/.cursor/mcp.json`。项目级配置在 Cursor 中更可靠（全局配置存在已知 bug，可能无法注入到 Agent 工具中）。使用 `--global` 可仅写入全局配置。

---

## 二、备选方案：Remote MCP（支持 Figma 链接）

若 Figma Desktop 未运行或无法使用，可改用 Remote MCP：

```bash
node .cursor/skills/ant-figma-skill/scripts/setup-figma-mcp.js --remote
```

会配置为 `https://mcp.figma.com/mcp`，支持通过 Figma frame 链接（含 node-id）获取设计。

**已知问题**：Cursor 的 Connect 按钮和 deep link 可能无法触发 OAuth。[[1]](https://forum.cursor.com/t/remote-mcp-server-connect-button-produces-zero-network-requests-oauth-flow-never-starts/150962/3) 若 OAuth 无法完成，请使用默认的 Desktop MCP。

### Desktop MCP 配置步骤（默认方案）

1. 安装并打开 [Figma Desktop 应用](https://www.figma.com/downloads/)
2. 打开 Figma Design 文件
3. 右上角切换到 **Dev Mode**
4. 右侧 Inspect 面板 → 启用 **MCP server**（复制 URL 确认）
5. 完全重启 Cursor

### 使用方式

- **Selection-based**：在 Figma Desktop 中选中 frame/layer，再在 Cursor 中提供 prompt
- Agent 会读取当前选中内容并生成代码

---

## 三、其他可能原因

| 原因 | 处理方式 |
|------|----------|
| **仅配置了全局 mcp.json** | Cursor 对全局配置存在已知 bug，建议使用项目级 `.cursor/mcp.json`。重新运行 setup 脚本（默认会写入项目级） |
| **未重启 Cursor** | 修改 mcp.json 后需完全退出并重新打开 Cursor |
| **Figma Desktop 未运行** | Desktop MCP 需 Figma Desktop 应用保持开启 |
| **MCP 未启用** | 在 Figma Dev Mode 中确认 MCP server 已启用 |
| **Figma 席位限制** | Starter/View/Collab 每月约 6 次调用；Dev/Full 无此限制 |
| **网络/代理** | Remote 需可访问 `https://mcp.figma.com` |

---

## 四、验证是否成功

1. 重启 Cursor 后，在 MCP 设置中查看 Figma 是否显示为已连接
2. 新建对话，确认是否出现 Figma 相关工具（如 `get_design_context`）
3. Desktop MCP：在 Figma 中选中 frame/layer 后，在 Cursor 中 prompt 应能获取设计上下文

---

## 五、参考链接

- [Figma Desktop MCP 配置](https://help.figma.com/hc/en-us/articles/35281186390679)
- [Figma Remote MCP 配置](https://help.figma.com/hc/en-us/articles/35281350665623)
- [Cursor MCP Connect 按钮 bug](https://forum.cursor.com/t/remote-mcp-server-connect-button-produces-zero-network-requests-oauth-flow-never-starts/150962/3)
