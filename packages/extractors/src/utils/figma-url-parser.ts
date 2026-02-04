/**
 * Figma URL解析工具
 * 支持解析各种Figma URL格式，提取fileKey和nodeId
 */

export interface FigmaUrlInfo {
  fileKey: string;
  nodeId?: string;
  fileName?: string;
  isValid: boolean;
  originalUrl: string;
}

/**
 * 解析Figma URL，提取fileKey和nodeId
 * 支持的URL格式：
 * - https://www.figma.com/file/{fileKey}/{fileName}
 * - https://www.figma.com/design/{fileKey}/{fileName}  
 * - https://www.figma.com/file/{fileKey}/{fileName}?node-id={nodeId}
 * - https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}
 */
export function parseFigmaUrl(url: string): FigmaUrlInfo {
  const result: FigmaUrlInfo = {
    fileKey: '',
    nodeId: undefined,
    fileName: undefined,
    isValid: false,
    originalUrl: url
  };

  try {
    const urlObj = new URL(url);
    
    // 检查是否是Figma域名
    if (!urlObj.hostname.includes('figma.com')) {
      return result;
    }

    // 解析路径：/file/{fileKey}/{fileName} 或 /design/{fileKey}/{fileName}
    const pathMatch = urlObj.pathname.match(/\/(file|design)\/([a-zA-Z0-9]+)(?:\/([^\/]+))?/);
    if (!pathMatch) {
      return result;
    }

    const [, , fileKey, fileName] = pathMatch;
    result.fileKey = fileKey;
    result.fileName = fileName ? decodeURIComponent(fileName) : undefined;

    // 解析node-id参数
    const nodeIdParam = urlObj.searchParams.get('node-id');
    if (nodeIdParam) {
      // 处理URL编码的node-id，如：1%3A2 -> 1:2
      result.nodeId = decodeURIComponent(nodeIdParam);
    }

    result.isValid = !!fileKey;
    return result;
  } catch (error) {
    return result;
  }
}

/**
 * 验证Figma URL是否有效
 */
export function isValidFigmaUrl(url: string): boolean {
  return parseFigmaUrl(url).isValid;
}

/**
 * 从文本中提取Figma URL
 */
export function extractFigmaUrls(text: string): string[] {
  const figmaUrlRegex = /https?:\/\/(?:www\.)?figma\.com\/(?:file|design)\/[a-zA-Z0-9]+(?:\/[^?\s]*)?(?:\?[^\s]*)*/g;
  return text.match(figmaUrlRegex) || [];
}

/**
 * 智能解析用户输入，提取Figma URL信息
 */
export function smartParseFigmaInput(input: string): FigmaUrlInfo[] {
  const urls = extractFigmaUrls(input);
  return urls.map(parseFigmaUrl).filter(info => info.isValid);
}
