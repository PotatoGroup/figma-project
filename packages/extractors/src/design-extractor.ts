import type {
  GetFileResponse,
  GetFileNodesResponse,
  Node as FigmaDocumentNode,
  Component,
  ComponentSet,
} from "@figma/rest-api-spec";
import { simplifyComponents, simplifyComponentSets } from "./transformers/component.js";
import { isVisible } from "./utils/common.js";
import type { ExtractorFn, TraversalOptions, GlobalVars, SimplifiedDesign } from "./types.js";
import { extractFromDesign } from "./node-walker.js";

/**
 * Extract a complete SimplifiedDesign from raw Figma API response using extractors.
 */
export function simplifyRawFigmaObject(
  apiResponse: GetFileResponse | GetFileNodesResponse,
  nodeExtractors: ExtractorFn[],  
  options: TraversalOptions = {},
): SimplifiedDesign {
  // Extract components, componentSets, and raw nodes from API response
  const { metadata, rawNodes, components, componentSets } = parseAPIResponse(apiResponse);

  // Process nodes using the flexible extractor system
  const globalVars: GlobalVars = { styles: {} };
  const { nodes: extractedNodes, globalVars: finalGlobalVars } = extractFromDesign(
    rawNodes,
    nodeExtractors,
    options,
    globalVars,
  );

  // Return complete design
  return {
    ...metadata,
    nodes: extractedNodes,
    components: simplifyComponents(components),
    componentSets: simplifyComponentSets(componentSets),
    globalVars: finalGlobalVars,
  };
}

/**
 * Parse the raw Figma API response to extract metadata, nodes, and components.
 */
function parseAPIResponse(data: GetFileResponse | GetFileNodesResponse) {
  const aggregatedComponents: Record<string, Component> = {};
  const aggregatedComponentSets: Record<string, ComponentSet> = {};
  let nodesToParse: Array<FigmaDocumentNode>;

  if ("nodes" in data) {
    // GetFileNodesResponse
    const nodeResponses = Object.values(data.nodes);
    nodeResponses.forEach((nodeResponse) => {
      if (nodeResponse.components) {
        Object.assign(aggregatedComponents, nodeResponse.components);
      }
      if (nodeResponse.componentSets) {
        Object.assign(aggregatedComponentSets, nodeResponse.componentSets);
      }
    });
    // 过滤掉 document 为 null/undefined 的节点（如 404 未找到）
    nodesToParse = nodeResponses
      .map((n) => n.document)
      .filter((doc): doc is NonNullable<typeof doc> => doc != null && isVisible(doc));
  } else {
    // GetFileResponse
    Object.assign(aggregatedComponents, data.components);
    Object.assign(aggregatedComponentSets, data.componentSets);
    const document = data.document;
    if (!document?.children?.length) {
      throw new Error(
        "Figma API 返回的 document 或 document.children 为空。请检查：1) 文件 Key 是否正确；2) API Token 是否有 file_content:read 权限；3) 文件是否为空"
      );
    }
    nodesToParse = document.children.filter(isVisible);
  }

  const { name, lastModified, thumbnailUrl } = data;

  return {
    metadata: {
      name,
      lastModified,
      thumbnailUrl: thumbnailUrl || "",
    },
    rawNodes: nodesToParse,
    components: aggregatedComponents,
    componentSets: aggregatedComponentSets,
  };
}
