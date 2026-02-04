import { request } from "./request";
import type {
  GetImagesResponse,
  GetFileResponse,
  GetFileNodesResponse,
  GetImageFillsResponse,
} from '@figma/rest-api-spec'
import { downloadAndProcessImage, type ImageProcessingResult } from '@figma-project/extractors'
import path from 'path'

type GetImagesParams = {
  imageRef?: string;
  nodeId?: string;
  fileName: string;
  needsCropping?: boolean;
  cropTransform?: any;
  requiresImageDimensions?: boolean;
}

type SvgOptions = {
  outlineText: boolean;
  includeId: boolean;
  simplifyStroke: boolean;
};

export class FigmaService {
  constructor(private readonly figmaApiKey: string) { }

  private doFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const headers = {
        "X-Figma-Token": this.figmaApiKey,
      };
      return request<T>(endpoint, {
        headers,
        ...options,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to make request to Figma API endpoint '${endpoint}': ${errorMessage}`,
      );
    }
  }
  async getRawFile(fileKey: string, depth?: number | null): Promise<GetFileResponse> {
    const endpoint = `/files/${fileKey}${depth ? `?depth=${depth}` : ""}`;
    const response = await this.doFetch<GetFileResponse>(endpoint);
    return response;
  }

  async getRawNodes(fileKey: string, nodeId: string, depth?: number | null): Promise<GetFileNodesResponse> {
    const endpoint = `/files/${fileKey}/nodes?ids=${nodeId}${depth ? `&depth=${depth}` : ""}`;
    const response = await this.doFetch<GetFileNodesResponse>(endpoint);
    return response;
  }

  async getImageFillUrls(fileKey: string): Promise<Record<string, string>> {
    const endpoint = `/files/${fileKey}/images`;
    const response = await this.doFetch<GetImageFillsResponse>(endpoint);
    return response.meta.images || {};
  }

  private filterValidImages(
    images: { [key: string]: string | null } | undefined,
  ): Record<string, string> {
    if (!images) return {};
    return Object.fromEntries(Object.entries(images).filter(([, value]) => !!value)) as Record<
      string,
      string
    >;
  }

  private buildSvgQueryParams(svgIds: string[], svgOptions: SvgOptions): string {
    const params = new URLSearchParams({
      ids: svgIds.join(","),
      format: "svg",
      svg_outline_text: String(svgOptions.outlineText),
      svg_include_id: String(svgOptions.includeId),
      svg_simplify_stroke: String(svgOptions.simplifyStroke),
    });
    return params.toString();
  }

  async getNodeRenderUrls(
    fileKey: string,
    nodeIds: string[],
    format: "png" | "svg",
    options: { pngScale?: number; svgOptions?: SvgOptions } = {},
  ): Promise<Record<string, string>> {
    if (nodeIds.length === 0) return {};

    if (format === "png") {
      const scale = options.pngScale || 2;
      const endpoint = `/images/${fileKey}?ids=${nodeIds.join(",")}&format=png&scale=${scale}`;
      const response = await this.doFetch<GetImagesResponse>(endpoint);
      return this.filterValidImages(response.images);
    } else {
      const svgOptions = options.svgOptions || {
        outlineText: true,
        includeId: false,
        simplifyStroke: true,
      };
      const params = this.buildSvgQueryParams(nodeIds, svgOptions);
      const endpoint = `/images/${fileKey}?${params}`;
      const response = await this.doFetch<GetImagesResponse>(endpoint);
      return this.filterValidImages(response.images);
    }
  }

  async getImages(fileKey: string, localPath: string, items: Array<GetImagesParams>, options: { pngScale?: number; svgOptions?: SvgOptions } = {}): Promise<ImageProcessingResult[]> {
    if (items.length === 0) return [];

    const sanitizedPath = path.normalize(localPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const resolvedPath = path.resolve(sanitizedPath);
    if (!resolvedPath.startsWith(path.resolve(process.cwd()))) {
      throw new Error("Invalid path specified. Directory traversal is not allowed.");
    }

    const { pngScale = 2, svgOptions } = options;
    const downloadPromises: Promise<ImageProcessingResult[]>[] = [];

    const imageFills = items.filter(
      (item): item is typeof item & { imageRef: string } => !!item.imageRef,
    );
    const renderNodes = items.filter(
      (item): item is typeof item & { nodeId: string } => !!item.nodeId,
    );

    if (imageFills.length > 0) {
      const fillUrls = await this.getImageFillUrls(fileKey);
      const fillDownloads = imageFills
        .map(({ imageRef, fileName, needsCropping, cropTransform, requiresImageDimensions }) => {
          const imageUrl = fillUrls[imageRef];
          return imageUrl
            ? downloadAndProcessImage(
              fileName,
              resolvedPath,
              imageUrl,
              needsCropping,
              cropTransform,
              requiresImageDimensions,
            )
            : null;
        })
        .filter((promise): promise is Promise<ImageProcessingResult> => promise !== null);

      if (fillDownloads.length > 0) {
        downloadPromises.push(Promise.all(fillDownloads));
      }
    }

    // Download rendered nodes with processing
    if (renderNodes.length > 0) {
      const pngNodes = renderNodes.filter((node) => !node.fileName.toLowerCase().endsWith(".svg"));
      const svgNodes = renderNodes.filter((node) => node.fileName.toLowerCase().endsWith(".svg"));

      // Download PNG renders
      if (pngNodes.length > 0) {
        const pngUrls = await this.getNodeRenderUrls(
          fileKey,
          pngNodes.map((n) => n.nodeId),
          "png",
          { pngScale },
        );
        const pngDownloads = pngNodes
          .map(({ nodeId, fileName, needsCropping, cropTransform, requiresImageDimensions }) => {
            const imageUrl = pngUrls[nodeId];
            return imageUrl
              ? downloadAndProcessImage(
                fileName,
                resolvedPath,
                imageUrl,
                needsCropping,
                cropTransform,
                requiresImageDimensions,
              )
              : null;
          })
          .filter((promise): promise is Promise<ImageProcessingResult> => promise !== null);

        if (pngDownloads.length > 0) {
          downloadPromises.push(Promise.all(pngDownloads));
        }
      }

      // Download SVG renders
      if (svgNodes.length > 0) {
        const svgUrls = await this.getNodeRenderUrls(
          fileKey,
          svgNodes.map((n) => n.nodeId),
          "svg",
          svgOptions ? { svgOptions } : {},
        );
        const svgDownloads = svgNodes
          .map(({ nodeId, fileName, needsCropping, cropTransform, requiresImageDimensions }) => {
            const imageUrl = svgUrls[nodeId];
            return imageUrl
              ? downloadAndProcessImage(
                fileName,
                resolvedPath,
                imageUrl,
                needsCropping,
                cropTransform,
                requiresImageDimensions,
              )
              : null;
          })
          .filter((promise): promise is Promise<ImageProcessingResult> => promise !== null);

        if (svgDownloads.length > 0) {
          downloadPromises.push(Promise.all(svgDownloads));
        }
      }
    }
    const results = await Promise.all(downloadPromises);
    return results.flat();
  }

}