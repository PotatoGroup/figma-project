import { FigmaService } from './service';
import type { GetFileResponse, GetFileNodesResponse } from '@figma/rest-api-spec';
import { simplifyRawFigmaObject, allExtractors } from "@figma-project/extractors";
import yaml from "js-yaml";

const resolver = (result: Object) => {
  return yaml.dump(result);
}

/** 检查 GetFileNodesResponse 是否包含有效节点（非全 null） */
function hasValidNodes(data: GetFileNodesResponse): boolean {
  const nodeResponses = Object.values(data.nodes);
  return nodeResponses.some((n) => n.document != null);
}

export const fetchFigmaNodes = async (
  service: FigmaService,
  options: { fileKey: string; nodeId?: string; depth?: number; resolver?: (result: Object) => any }
) => {
  const { fileKey, nodeId, depth, resolver: resolverFn = resolver } = options;
  let rawFigmaResponse: GetFileResponse | GetFileNodesResponse;
  if (nodeId) {
    const nodesResponse = await service.getRawNodes(fileKey, nodeId, depth);
    // 当指定 node-id 时，若 API 返回的节点全为 null（如 ID 格式/权限问题），回退到获取完整文件
    if (!hasValidNodes(nodesResponse)) {
      rawFigmaResponse = await service.getRawFile(fileKey, depth);
    } else {
      rawFigmaResponse = nodesResponse;
    }
  } else {
    rawFigmaResponse = await service.getRawFile(fileKey, depth);
  }
  const simplifiedDesign = simplifyRawFigmaObject(rawFigmaResponse, allExtractors, {
    maxDepth: depth ?? 10,
  });
  const { nodes, globalVars, ...metadata } = simplifiedDesign;
  const result = {
    metadata,
    nodes,
    globalVars,
  };
  return resolverFn(result);
}