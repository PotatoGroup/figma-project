import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { defineConfig } from "father";
import { name } from "./package.json";

const cwd = process.cwd();
const distDir = path.join(cwd, "dist");
const zipName = `${name}.zip`;
const zipPath = path.join(cwd, zipName);

function zipPlugin() {
  return {
    apply(compiler: { hooks: { afterEmit: { tap: (name: string, fn: () => void) => void } } }) {
      compiler.hooks.afterEmit.tap("ZipDistPlugin", () => {
        if (!fs.existsSync(distDir)) return;
        try {
          execSync(`zip -rq "${zipPath}" .`, {
            cwd: distDir,
            stdio: "inherit",
          });
          const stat = fs.statSync(zipPath);
          console.log(`已生成压缩包: ${zipName} (${(stat.size / 1024).toFixed(2)} KB)`);
        } catch (err) {
          console.error("压缩失败:", err);
        }
      });
    },
  };
}

export default defineConfig({
  umd: {
    entry: "src/scripts/index.ts",
    platform: "node",
    output: {
      path: "dist/scripts",
      filename: "index.js",
    },
    chainWebpack(memo) {
      const CopyPlugin = require("copy-webpack-plugin");
      memo.plugin("copy-to-dist").use(CopyPlugin, [
        {
          patterns: [
            {
              from: "**/*",
              context: path.join(cwd, "src"),
              to: "..",
              globOptions: {
                ignore: ["**/scripts/**", "scripts/**"],
                dot: true, // 匹配以 . 开头的文件（如 .env）
              },
            },
          ],
        },
      ]);
      memo.plugin("zip-plugins").use(zipPlugin);
      return memo;
    },
  },
});
