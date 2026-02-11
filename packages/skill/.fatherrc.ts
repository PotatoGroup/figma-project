import { defineConfig } from "father";

/**
 * cjs: 仅编译 src/scripts，输出到 ant-figma-skill/scripts，避免 reference 等非 scripts 内容进入 scripts 目录。
 * build-skill.mjs: 拷贝 src 下除 scripts 外的内容到 ant-figma-skill，并 zip。
 */
export default defineConfig({
  cjs: {
    input: "src/scripts",
    output: "ant-figma-skill/scripts",
  },
});
