import type { GetFileResponse, GetFileNodesResponse } from '@figma/rest-api-spec';
import { type ImageProcessingResult } from '@figma-project/extractors';
type GetImagesParams = {
    imageRef?: string;
    nodeId?: string;
    fileName: string;
    needsCropping?: boolean;
    cropTransform?: any;
    requiresImageDimensions?: boolean;
};
type SvgOptions = {
    outlineText: boolean;
    includeId: boolean;
    simplifyStroke: boolean;
};
export declare class FigmaService {
    private readonly figmaApiKey;
    constructor(figmaApiKey: string);
    private doFetch;
    getRawFile(fileKey: string, depth?: number | null): Promise<GetFileResponse>;
    getRawNodes(fileKey: string, nodeId: string, depth?: number | null): Promise<GetFileNodesResponse>;
    getImageFillUrls(fileKey: string): Promise<Record<string, string>>;
    private filterValidImages;
    private buildSvgQueryParams;
    getNodeRenderUrls(fileKey: string, nodeIds: string[], format: "png" | "svg", options?: {
        pngScale?: number;
        svgOptions?: SvgOptions;
    }): Promise<Record<string, string>>;
    getImages(fileKey: string, localPath: string, items: Array<GetImagesParams>, options?: {
        pngScale?: number;
        svgOptions?: SvgOptions;
    }): Promise<ImageProcessingResult[]>;
}
export {};
//# sourceMappingURL=service.d.ts.map