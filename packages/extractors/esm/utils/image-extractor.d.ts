/**
 * 从Figma数据中提取图片节点信息
 * 用于自动识别需要下载的图片资源
 */
interface ImageNodeInfo {
    nodeId: string;
    fileName: string;
    imageRef?: string;
    needsCropping?: boolean;
    cropTransform?: number[][];
    requiresImageDimensions?: boolean;
    filenameSuffix?: string;
}
/**
 * 从Figma数据中提取图片节点
 */
export declare function extractImageNodes(figmaDataText: string): ImageNodeInfo[];
/**
 * 过滤和去重图片节点
 */
export declare function deduplicateImageNodes(nodes: ImageNodeInfo[]): ImageNodeInfo[];
/**
 * 智能提取图片节点，包含去重和过滤
 */
export declare function smartExtractImageNodes(figmaDataText: string): ImageNodeInfo[];
export {};
//# sourceMappingURL=image-extractor.d.ts.map