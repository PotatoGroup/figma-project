/**
 * skill 构建脚本：
 * 1. 拷贝 src 下所有文件/目录到输出目录
 * 2. 将输出目录压缩为 zip
 */

import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(__dirname, "..");
const distDir = path.join(cwd, "implement-design");
const zipName = "implement-design.zip";
const zipPath = path.join(cwd, zipName);

function copySrc() {
  const srcDir = path.join(cwd, "src");
  if (!fs.existsSync(srcDir)) {
    console.error("src 目录不存在");
    process.exit(1);
  }
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const ent of entries) {
      const srcPath = path.join(src, ent.name);
      const destPath = path.join(dest, ent.name);
      if (ent.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(srcDir, distDir);
  console.log("  copied src -> implement-design");
}

function zipDist() {
  if (!fs.existsSync(distDir)) {
    console.error("implement-design 不存在");
    process.exit(1);
  }
  execSync(`zip -rq "${zipPath}" .`, {
    cwd: distDir,
    stdio: "inherit",
  });
  const stat = fs.statSync(zipPath);
  console.log(`  generated ${zipName} (${(stat.size / 1024).toFixed(2)} KB)`);
}

function main() {
  try {
    console.log("build-skill: copy...");
    copySrc();
    console.log("build-skill: zip...");
    zipDist();
    console.log("build-skill: done.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
