/**
 * 将 src 下非 scripts 的文件和目录拷贝到 dist（father 仅负责 scripts 的构建）
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const scriptsDir = path.join(srcDir, "scripts");

function copyRecursive(src, dest, skipScripts) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (skipScripts && (src === scriptsDir || src.startsWith(scriptsDir + path.sep))) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      const srcChild = path.join(src, name);
      const destChild = path.join(dest, name);
      if (srcChild === scriptsDir || srcChild.startsWith(scriptsDir + path.sep)) continue;
      copyRecursive(srcChild, destChild, skipScripts);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(srcDir, distDir, true);
