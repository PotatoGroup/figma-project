import { FigmaService } from './service';
import type { ImageProcessingResult } from '@figma-project/extractors'
import type { GetImagesParams } from './service'

export interface FigmaNode extends GetImagesParams {
  filenameSuffix?: string;
}

export const fetchFigmaAssets = async (service: FigmaService, options: { fileKey: string, nodes: FigmaNode[], localPath: string, pngScale?: number }) => {
  const { fileKey, nodes, localPath, pngScale = 2 } = options;
  const downloadItems = [];
  const downloadToRequests = new Map<number, string[]>(); // download index -> requested filenames
  const seenDownloads = new Map<string, number>(); // uniqueKey -> download index

  for (const node of nodes) {
    // Apply filename suffix if provided
    let finalFileName = node.fileName;
    if (node.filenameSuffix && !finalFileName.includes(node.filenameSuffix)) {
      const ext = finalFileName.split(".").pop();
      const nameWithoutExt = finalFileName.substring(0, finalFileName.lastIndexOf("."));
      finalFileName = `${nameWithoutExt}-${node.filenameSuffix}.${ext}`;
    }

    const downloadItem = {
      fileName: finalFileName,
      needsCropping: node.needsCropping || false,
      cropTransform: node.cropTransform,
      requiresImageDimensions: node.requiresImageDimensions || false,
    };

    if (node.imageRef) {
      // For imageRefs, check if we've already planned to download this
      const uniqueKey = `${node.imageRef}-${node.filenameSuffix || "none"}`;

      if (!node.filenameSuffix && seenDownloads.has(uniqueKey)) {
        // Already planning to download this, just add to the requests list
        const downloadIndex = seenDownloads.get(uniqueKey)!;
        const requests = downloadToRequests.get(downloadIndex)!;
        if (!requests.includes(finalFileName)) {
          requests.push(finalFileName);
        }

        // Update requiresImageDimensions if needed
        if (downloadItem.requiresImageDimensions) {
          downloadItems[downloadIndex]!.requiresImageDimensions = true;
        }
      } else {
        // New unique download
        const downloadIndex = downloadItems.length;
        downloadItems.push({ ...downloadItem, imageRef: node.imageRef });
        downloadToRequests.set(downloadIndex, [finalFileName]);
        seenDownloads.set(uniqueKey, downloadIndex);
      }
    } else {
      // Rendered nodes are always unique
      const downloadIndex = downloadItems.length;
      downloadItems.push({ ...downloadItem, nodeId: node.nodeId });
      downloadToRequests.set(downloadIndex, [finalFileName]);
    }
  }

  const allDownloads = await service.getImages(fileKey, localPath, downloadItems, {
    pngScale,
  });

  const successCount = allDownloads.filter(Boolean).length;

  // Format results with aliases
  const imagesList = allDownloads
    .map((result: ImageProcessingResult | null | undefined, index: number) => {
      if (!result) return '';
      const fileName = result.filePath.split("/").pop() || result.filePath;
      const dimensions = `${result.finalDimensions.width}x${result.finalDimensions.height}`;
      const cropStatus = result.wasCropped ? " (cropped)" : "";

      const dimensionInfo = result.cssVariables
        ? `${dimensions} | ${result.cssVariables}`
        : dimensions;

      // Show all the filenames that were requested for this download
      const requestedNames = downloadToRequests.get(index) || [fileName];
      const aliasText =
        requestedNames.length > 1
          ? ` (also requested as: ${requestedNames.filter((name: string) => name !== fileName).join(", ")})`
          : "";

      return `- ${fileName}: ${dimensionInfo}${cropStatus}${aliasText}`;
    })
    .filter(Boolean)
    .join("\n");

  return {
    count: successCount,
    images: imagesList,
  }
}