/**
 * 轻量入口：仅导出 skill 工作流所需 API，不依赖 image-processing（sharp）。
 * 用于打包成独立可运行的 Node 脚本时避免引入原生模块 sharp。
 */
export { parseFigmaUrl } from './utils/figma-url-parser.js';
export type { FigmaUrlInfo } from './utils/figma-url-parser.js';
export { smartExtractImageNodes } from './utils/image-extractor.js';
