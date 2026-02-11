import { z } from 'zod'
import { FigmaService } from '@figma-project/service'
import { fetchFigmaNodes } from '@figma-project/service'

const parameters = {
  fileKey: z
    .string()
    .describe(
      "The key of the Figma file to fetch, often found in a provided URL like figma.com/(file|design)/<fileKey>/...",
    ),
  nodeId: z
    .string()
    .optional()
    .describe(
      "The ID of the node to fetch, often found as URL parameter node-id=<nodeId>, always use if provided",
    ),
  depth: z
    .number()
    .optional()
    .describe(
      "OPTIONAL. Do NOT use unless explicitly requested by the user. Controls how many levels deep to traverse the node tree.",
    ),
};

const parametersSchema = z.object(parameters);
export type GetFigmaDataParams = z.infer<typeof parametersSchema>;

const getFigmaData = async (params: GetFigmaDataParams, figmaService: FigmaService, outputFormat: "yaml" | "json") => {
  try {
    const result = await fetchFigmaNodes(figmaService, params);
    const formattedResult =
      outputFormat === "json" ? JSON.stringify(result, null, 2) : result;
    return {
      content: [{ type: "text" as const, text: formattedResult }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    return {
      isError: true,
      content: [{ type: "text" as const, text: `Error fetching file: ${message}` }],
    };
  }
};

export const getFigmaDataTool = {
  name: "get_figma_data",
  description: "Get comprehensive Figma file data including layout, content, visuals, and component information",
  parameters,
  execute: getFigmaData,
};