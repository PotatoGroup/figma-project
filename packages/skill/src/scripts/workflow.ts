import path from "path";
import fs from "fs";
import { config as loadEnv } from "dotenv";
import { FigmaService, fetchFigmaNodes, fetchFigmaAssets } from '@figma-project/service';
import { parseFigmaUrl, smartExtractImageNodes } from '@figma-project/extractors';

/**
 * 返回 skill 根目录下的临时资源目录（与 dist/scripts 同级，即 dist/_assets_）。
 * 若目录不存在则自动创建，保证返回的路径可直接使用。
 */
function getAssetsPath(): string {
  const assetsPath = path.join(process.cwd(), "_assets_");
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
  }
  return assetsPath;
}

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
    console.error(
      "FIGMA_API_KEY is not set. Please set it in skill root .env or project root .env (FIGMA_API_KEY=your_token)"
    );
    process.exit(1);
  }
  return figmaApiKey;
}


/**
 * 解析figma-url，获取元数据、image资源、节点信息
 */

const FIGMA_NODES_FILENAME = "figmaNodes.yaml";

/**
 * Figma 网页 URL 中 node-id 使用连字符（如 420-1267），REST API 要求使用冒号（420:1267）。
 * 将 URL 中的 node-id 转为 API 所需格式。
 */
function normalizeFigmaNodeId(nodeId: string): string {
  if (/^\d+-\d+$/.test(nodeId)) {
    return nodeId.replace("-", ":");
  }
  return nodeId;
}

export type StartFigmaServiceError = {
  isError: true;
  content: Array<{ type: "text"; text: string }>;
};

export type StartFigmaServiceSuccess = {
  isError?: false;
  /** 临时资源目录（skill 根目录下的 _assets_），内含 figmaNodes.yaml 与图片文件 */
  assetsPath: string;
  /** 大模型回答完成后调用，删除临时目录 _assets_ */
  cleanup: () => void;
};

export async function startFigmaService(
  figmaUrl: string
): Promise<{
  assetsPath: string;
  cleanup: () => void;
}> {
  const urlInfo = parseFigmaUrl(figmaUrl);
  if (!urlInfo.isValid) {
    console.error(`无效的Figma URL: ${figmaUrl}\n请提供有效的Figma文件或设计链接`);
    process.exit(1);
  }
  // Figma 网页 URL 中 node-id 为连字符（如 420-1267），API 要求冒号（420:1267）
  const nodeId = urlInfo.nodeId ? normalizeFigmaNodeId(urlInfo.nodeId) : undefined;
  const figmaApiKey = getFigmaApiKey();
  const figmaService = new FigmaService(figmaApiKey);
  const assetsPath = getAssetsPath();

  const figmaData = await fetchFigmaNodes(figmaService, {
    fileKey: urlInfo.fileKey,
    nodeId,
  });
  const figmaDataPath = path.join(assetsPath, FIGMA_NODES_FILENAME);
  fs.writeFileSync(figmaDataPath, typeof figmaData === "string" ? figmaData : String(figmaData), "utf-8");

  const imageNodes = smartExtractImageNodes(
    typeof figmaData === "string" ? figmaData : String(figmaData)
  );
  const figmaImagesParams = {
    fileKey: urlInfo.fileKey,
    nodes: imageNodes,
    localPath: assetsPath,
    pngScale: 2,
  };
  await fetchFigmaAssets(figmaService, figmaImagesParams);

  const cleanup = () => {
    try {
      if (fs.existsSync(assetsPath)) {
        fs.rmSync(assetsPath, { recursive: true, force: true });
      }
    } catch (err) {
      console.warn("清理临时目录 _assets_ 失败:", err);
    }
  };

  return {
    assetsPath,
    cleanup,
  };
}