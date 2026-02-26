#!/usr/bin/env node
/**
 * 配置 Figma MCP Server，确保可在 Cursor 中使用
 *
 * 用法:
 *   node scripts/setup-figma-mcp.js        # 默认：Desktop MCP（本地优先，需 Figma Desktop 运行，无需 OAuth）
 *   node scripts/setup-figma-mcp.js --remote  # Remote MCP（支持 Figma 链接，需 OAuth）
 *   node scripts/setup-figma-mcp.js --global  # 仅写入全局配置（默认同时写入项目级 + 全局）
 *
 * 输出: 0=成功, 1=失败
 *
 * 注意：项目级 .cursor/mcp.json 在 Cursor 中更可靠（全局配置存在已知 bug），
 * 脚本默认优先写入项目级配置。
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const FIGMA_REMOTE_URL = 'https://mcp.figma.com/mcp';
const FIGMA_DESKTOP_URL = 'http://127.0.0.1:3845/mcp';
const FIGMA_MCP_KEY = 'figma-desktop'; // 与 Figma 官方文档一致

const USE_REMOTE = process.argv.includes('--remote');
const GLOBAL_ONLY = process.argv.includes('--global');

function getGlobalMcpPath() {
  const home = process.env.HOME || process.env.USERPROFILE;
  return path.join(home, '.cursor', 'mcp.json');
}

function getProjectMcpPath() {
  return path.join(process.cwd(), '.cursor', 'mcp.json');
}

function findFigmaMcpKey(mcpServers) {
  if (!mcpServers || typeof mcpServers !== 'object') return null;
  for (const key of Object.keys(mcpServers)) {
    const s = mcpServers[key];
    const url = s?.url;
    if (url && (String(url).includes('mcp.figma.com/mcp') || String(url).includes('127.0.0.1') && String(url).includes('/mcp')))
      return key;
  }
  return null;
}

function getTargetConfig() {
  if (USE_REMOTE) {
    return { url: FIGMA_REMOTE_URL };
  }
  return { url: FIGMA_DESKTOP_URL }; // 默认 Desktop MCP（本地）
}

function isCurrentConfigCorrect(mcpServers) {
  const key = findFigmaMcpKey(mcpServers);
  if (!key) return false;
  const target = getTargetConfig();
  const current = mcpServers[key];
  return current?.url === target.url;
}

function mergeFigmaConfig(config) {
  const mcpServers = config.mcpServers || {};
  const existingKey = findFigmaMcpKey(mcpServers);
  if (existingKey) delete mcpServers[existingKey];
  mcpServers[FIGMA_MCP_KEY] = getTargetConfig();
  return { ...config, mcpServers };
}

function writeMcpConfig(mcpPath, config) {
  const dir = path.dirname(mcpPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(mcpPath, JSON.stringify(config, null, 2), 'utf-8');
}

function verifyDesktopConnection() {
  return new Promise((resolve) => {
    if (USE_REMOTE) {
      resolve({ ok: true, skip: true });
      return;
    }
    const url = new URL(FIGMA_DESKTOP_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port || 3845,
        path: url.pathname,
        method: 'GET',
        timeout: 2000,
      },
      (res) => resolve({ ok: res.statusCode < 500 })
    );
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false });
    });
    req.end();
  });
}

function main() {
  const targetConfig = getTargetConfig();
  let config = {};

  try {
    const globalPath = getGlobalMcpPath();
    if (fs.existsSync(globalPath)) {
      const raw = fs.readFileSync(globalPath, 'utf-8');
      config = JSON.parse(raw);
    }
  } catch (e) {
    console.error('读取 mcp.json 失败:', e?.message || e);
    process.exit(1);
  }

  // 检查项目级配置是否已正确
  const projectPath = getProjectMcpPath();
  if (!GLOBAL_ONLY && fs.existsSync(projectPath)) {
    try {
      const projectConfig = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
      if (isCurrentConfigCorrect(projectConfig.mcpServers || {})) {
        console.log('Figma MCP 已在项目级配置中正确设置，无需修改');
        printPostInstall(USE_REMOTE);
        process.exit(0);
      }
    } catch (_) { }
  }

  const mergedConfig = mergeFigmaConfig(config);
  const writtenPaths = [];

  try {
    // 优先写入项目级配置（Cursor 对项目级配置支持更可靠）
    if (!GLOBAL_ONLY) {
      const projectPath = getProjectMcpPath();
      let projectConfig = {};
      if (fs.existsSync(projectPath)) {
        try {
          projectConfig = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
        } catch (_) {
          projectConfig = {};
        }
      }
      // 若项目级为空，则基于全局配置合并，避免丢失其他 MCP
      const baseForProject = Object.keys(projectConfig.mcpServers || {}).length > 0
        ? projectConfig
        : mergedConfig;
      const mergedProject = mergeFigmaConfig(baseForProject);
      writeMcpConfig(projectPath, mergedProject);
      writtenPaths.push(projectPath);
    }

    // 写入全局配置
    const globalPath = getGlobalMcpPath();
    writeMcpConfig(globalPath, mergedConfig);
    writtenPaths.push(globalPath);

    console.log('已写入 Figma MCP 配置:');
    writtenPaths.forEach((p) => console.log('  -', p));
    console.log('');
    console.log('当前配置:');
    console.log(JSON.stringify({ [FIGMA_MCP_KEY]: targetConfig }, null, 2));
    console.log('');

    // 验证 Desktop MCP 连接并输出后续说明
    const finish = () => {
      printPostInstall(USE_REMOTE);
      process.exit(0);
    };

    if (!USE_REMOTE) {
      verifyDesktopConnection().then(({ ok, skip }) => {
        if (!skip) {
          if (ok) {
            console.log('✓ Figma Desktop MCP 服务已就绪 (127.0.0.1:3845)');
          } else {
            console.log('⚠ 无法连接到 Figma Desktop MCP (127.0.0.1:3845)');
            console.log('  请确认 Figma Desktop 已打开，且已在 Dev Mode 中启用 MCP server');
          }
        }
        console.log('');
        finish();
      });
    } else {
      console.log('');
      finish();
    }
  } catch (e) {
    console.error('写入 mcp.json 失败:', e?.message || e);
    process.exit(1);
  }
}

function printPostInstall(useRemote) {
  if (useRemote) {
    console.log(`--- Remote MCP（支持 Figma 链接）---
      1. 重启 Cursor 后，在 MCP 设置中连接 Figma
      2. 完成 OAuth 认证
      3. 使用 Figma frame 链接（含 node-id）即可获取设计
      若需改用本地 Desktop MCP：
        node .cursor/skills/ant-figma-skill/scripts/setup-figma-mcp.js
      详见: .cursor/skills/ant-figma-skill/docs/FIGMA_MCP_TROUBLESHOOTING.md`);
  } else {
    console.log(`--- Desktop MCP（本地优先，无需 OAuth）---
      1. 安装并打开 Figma Desktop 应用
      2. 打开 Figma Design 文件
      3. 右上角切换到 Dev Mode
      4. 右侧 Inspect 面板 → 启用 MCP server
      5. 完全重启 Cursor
      使用方式：在 Figma 中选中 frame/layer，再在 Cursor 中提供 prompt。
      若 Figma Desktop 未运行，可改用 Remote MCP：
      node .cursor/skills/ant-figma-skill/scripts/setup-figma-mcp.js --remote
      详见: .cursor/skills/ant-figma-skill/docs/FIGMA_MCP_TROUBLESHOOTING.md`);
  }
}

main();
