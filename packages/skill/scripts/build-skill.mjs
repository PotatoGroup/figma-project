/**
 * ant-figma-skill 构建脚本：仅负责
 * 1. 拷贝 src 下除 scripts 以外的内容到 ant-figma-skill（scripts 已由 tsc 输出到 ant-figma-skill/scripts）
 * 2. 删除 ant-figma-skill/scripts 下的 .d.ts 文件
 * 3. 将 ant-figma-skill 打成 ant-figma-skill.zip
 *
 * 前置：需先执行 tsc，将 src/scripts 编译到 ant-figma-skill/scripts。
 */

import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(__dirname, "..");
const distDir = path.join(cwd, "ant-figma-skill");
const zipName = "ant-figma-skill.zip";
const zipPath = path.join(cwd, zipName);
const scriptsDir = path.join(distDir, "scripts");

function removeDeclarationFiles() {
  if (!fs.existsSync(scriptsDir)) return;
  const entries = fs.readdirSync(scriptsDir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isFile() && ent.name.endsWith(".d.ts")) {
      fs.unlinkSync(path.join(scriptsDir, ent.name));
    }
  }
  console.log("  removed .d.ts from ant-figma-skill/scripts");
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
    console.error("ant-figma-skill 不存在，请先执行 tsc 与拷贝");
    process.exit(1);
  }
  execSync(`zip -rq "${zipPath}" .`, {
    cwd: distDir,
    stdio: "inherit",
  });
  const stat = fs.statSync(zipPath);
  console.log(`  generated ${zipName} (${(stat.size / 1024).toFixed(2)} KB)`);
}

async function main() {
  console.log("build-skill: copy (non-scripts only)...");
  copyNonScripts();
  removeDeclarationFiles();
  console.log("build-skill: zip...");
  zipDist();
  console.log("build-skill: done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
