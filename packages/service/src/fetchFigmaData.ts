import { FigmaService } from './service';
import type { GetFileResponse, GetFileNodesResponse } from '@figma/rest-api-spec';
import { simplifyRawFigmaObject, allExtractors } from "@figma-project/extractors";
import yaml from "js-yaml";

const resolver = (result: Object) => {
  return yaml.dump(result);
}

export const fetchFigmaData = async (
  service: FigmaService,
  options: { fileKey: string; nodeId?: string; depth?: number; resolver?: (result: Object) => any }
) => {
  const { fileKey, nodeId, depth, resolver: resolverFn = resolver } = options;
  let rawFigmaResponse: GetFileResponse | GetFileNodesResponse;
  if (nodeId) {
    rawFigmaResponse = await service.getRawNodes(fileKey, nodeId, depth);
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