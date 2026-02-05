# ant-figma-mcp

[![NPM version](https://img.shields.io/npm/v/ant-figma-mcp.svg?style=flat)](https://npmjs.com/package/ant-figma-mcp)
[![NPM downloads](http://img.shields.io/npm/dm/ant-figma-mcp.svg?style=flat)](https://npmjs.com/package/ant-figma-mcp)

基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的 Figma 能力服务，为 Cursor 等支持 MCP 的 IDE 提供 Figma 设计数据获取与「设计 → React 组件」的一站式工作流。

## ✨ 核心特性

- 🎯 **一键转换**：只需提供Figma URL，自动完成设计到代码的全流程转换
- 🤖 **智能工作流**：大模型自动调用多个工具，无需手动操作
- 🎨 **精确还原**：高保真还原Figma设计，包括布局、样式、交互
- 📱 **响应式支持**：生成适配多端的响应式组件代码
- 🔧 **TypeScript优先**：生成类型安全的React组件代码
- 🖼️ **资源管理**：自动下载和优化图片资源
- 🎪 **组件化设计**：支持复杂组件的层级结构和状态管理 


## 🚀 快速开始

### 基本使用

只需要向大模型提供一个Figma URL，即可自动生成React组件代码：

```
https://www.figma.com/file/abc123/MyDesign?node-id=1:2
```

大模型会自动：
1. 解析Figma URL，提取设计数据
2. 下载相关的图片资源
3. 生成高质量的React组件代码
4. 提供完整的TypeScript类型定义和CSS样式

### 安装配置

添加figma-mcp到客户端，如Cursor：

#### MacOS / Linux

```json
{
  "mcpServers": {
    "ant-figma-mcp": {
      "command": "npx",
       "args": [
          "-y",
          "ant-figma-mcp",
          "--figma-api-key=You figma access token"
        ]
    }
  }
}
```

#### Windows

```json
{
  "mcpServers": {
    "ant-figma-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "ant-figma-mcp", "--figma-api-key=You figma access token"]
    }
  }
}
```

**可选参数：**
- `--json` 输出 JSON 格式（默认 YAML）
- `--include-images` 启用图片下载工具（默认是开启）

## License

MIT
