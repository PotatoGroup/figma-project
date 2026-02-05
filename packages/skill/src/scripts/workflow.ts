import path from "path";
import { config as loadEnv } from "dotenv";
import { FigmaService } from '@figma-project/service';

/**
 * 从当前 skill 根目录的 .env 或项目运行时根目录的 .env 中获取 FIGMA_API_KEY，否则报错。
 * 使用 dotenv 加载，先加载 skill 根目录，再加载运行时根目录（后者不覆盖已存在的变量）。
 * - skill 根目录：相对打包后的脚本位置，即 dist 目录（与 dist/scripts 同级）
 * - 运行时根目录：process.cwd()
 */
function getFigmaApiKey(): string {
  const skillRoot = path.join(__dirname, "..");
  const runtimeRoot = process.cwd();
  loadEnv({ path: path.join(skillRoot, ".env"), override: false });
  loadEnv({ path: path.join(runtimeRoot, ".env"), override: false });
  const figmaApiKey = process.env.FIGMA_API_KEY;
  if (!figmaApiKey) {
    throw new Error(
      "FIGMA_API_KEY is not set. Please set it in skill root .env or project root .env (FIGMA_API_KEY=your_token)"
    );
  }
  return figmaApiKey;
}


/**
 * 解析figma-url，获取元数据、image资源、节点信息
 */

function startFigmaService() {
  const figmaApiKey = getFigmaApiKey();
  const figmaService = new FigmaService(figmaApiKey);
  return figmaService;
}


/**
 * extractors处理节点数据
 */

/**
 * reference匹配组件，生成组件代码
 */