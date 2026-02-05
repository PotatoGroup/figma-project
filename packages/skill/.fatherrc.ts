import path from "path";
import { defineConfig } from "father";

const cwd = process.cwd();
const srcDir = path.join(cwd, "src");

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
              context: srcDir,
              to: "..",
              globOptions: {
                ignore: ["**/scripts/**", "scripts/**"],
                dot: true, // 匹配以 . 开头的文件（如 .env）
              },
            },
          ],
        },
      ]);
      return memo;
    },
  },
});
