/**
 * ant-figma-skill 构建脚本：
 * 1. esbuild 将 src/scripts 打成单文件 bundle，添加 shebang 使可直接在 Node 下运行，输出到 ant-figma-skill/scripts/index.js
 * 2. 拷贝 src 下除 scripts 以外的文件/目录到 ant-figma-skill
 * 3. 将 ant-figma-skill 压缩为 ant-figma-skill.zip
 */

import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const distDir = path.join(cwd, "ant-figma-skill");
const scriptsDir = path.join(distDir, "scripts");
const zipName = "ant-figma-skill.zip";
const zipPath = path.join(cwd, zipName);

async function bundleScripts() {
  const esbuild = require("esbuild");
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  await esbuild.build({
    entryPoints: [path.join(cwd, "src", "scripts", "index.ts")],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: path.join(scriptsDir, "index.js"),
    minify: false,
    sourcemap: false,
    external: ["sharp"],
    banner: { js: "#!/usr/bin/env node\n" },
  });
  console.log("  bundled src/scripts -> ant-figma-skill/scripts/index.js (CLI)");
}

function copyNonScripts() {
  const srcDir = path.join(cwd, "src");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  function copyRecursive(src, dest, skipDir = "scripts") {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const ent of entries) {
      const srcPath = path.join(src, ent.name);
      const destPath = path.join(dest, ent.name);
      if (ent.name === skipDir) continue;
      if (ent.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath, skipDir);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(srcDir, distDir);
  console.log("  copied src (excluding scripts) -> ant-figma-skill");
}

function zipDist() {
  if (!fs.existsSync(distDir)) {
    console.error("ant-figma-skill 不存在");
    process.exit(1);
  }
  execSync(`zip -rq "${zipPath}" .`, {
    cwd: distDir,
    stdio: "inherit",
  });
  const stat = fs.statSync(zipPath);
  console.log(`  generated ${zipName} (${(stat.size / 1024).toFixed(2)} KB)`);
}

/** 验证 scripts/index.js 在 Node 下可正常执行 */
function verifyNodeExecution() {
  const scriptPath = path.join(scriptsDir, "index.js");
  if (!fs.existsSync(scriptPath)) {
    console.error("  verify failed: index.js 不存在");
    process.exit(1);
  }
  try {
    execSync(`node "${scriptPath}" --help`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    console.log("  verified: node ant-figma-skill/scripts/index.js --help ✓");
  } catch (err) {
    console.error("  verify failed: Node 执行失败", err?.message || err);
    process.exit(1);
  }
}

async function main() {
  try {
    console.log("build-skill: bundle (CLI)...");
    await bundleScripts();
    console.log("build-skill: copy (non-scripts only)...");
    copyNonScripts();
    console.log("build-skill: verify (Node)...");
    verifyNodeExecution();
    console.log("build-skill: zip...");
    zipDist();
    console.log("build-skill: done.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
