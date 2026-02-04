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
export declare function parseFigmaUrl(url: string): FigmaUrlInfo;
/**
 * 验证Figma URL是否有效
 */
export declare function isValidFigmaUrl(url: string): boolean;
/**
 * 从文本中提取Figma URL
 */
export declare function extractFigmaUrls(text: string): string[];
/**
 * 智能解析用户输入，提取Figma URL信息
 */
export declare function smartParseFigmaInput(input: string): FigmaUrlInfo[];
//# sourceMappingURL=figma-url-parser.d.ts.map