import { z } from 'zod'
import { FigmaService } from '@figma-project/service'
import { fetchFigmaAssets } from '@figma-project/service'

const parameters = {
  fileKey: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "File key must be alphanumeric")
    .describe("The key of the Figma file containing the images"),
  nodes: z
    .object({
      nodeId: z
        .string()
        .regex(/^I?\d+:\d+(?:;\d+:\d+)*$/, "Node ID must be like '1234:5678' or 'I5666:180910;1:10515;1:10336'")
        .describe("The ID of the Figma image node to fetch, formatted as 1234:5678"),
      imageRef: z
        .string()
        .optional()
        .describe(
          "If a node has an imageRef fill, you must include this variable. Leave blank when downloading Vector SVG images.",
        ),
      fileName: z
        .string()
        .regex(/^[a-zA-Z0-9_.-]+$/, "File name can only contain alphanumeric characters, underscores, dots, and hyphens")
        .describe(
          "The local name for saving the fetched file, including extension. Either png or svg.",
        ),
      needsCropping: z
        .boolean()
        .optional()
        .describe("Whether this image needs cropping based on its transform matrix"),
      cropTransform: z
        .array(z.array(z.number()))
        .optional()
        .describe("Figma transform matrix for image cropping"),
      requiresImageDimensions: z
        .boolean()
        .optional()
        .describe("Whether this image requires dimension information for CSS variables"),
      filenameSuffix: z
        .string()
        .optional()
        .describe(
          "Suffix to add to filename for unique cropped images, provided in the Figma data (e.g., 'abc123')",
        ),
    })
    .array()
    .describe("The nodes to fetch as images"),
  pngScale: z
    .number()
    .positive()
    .optional()
    .default(2)
    .describe(
      "Export scale for PNG images. Optional, defaults to 2 if not specified. Affects PNG images only.",
    ),
  localPath: z
    .string()
    .describe(
      "The absolute path to the directory where images are stored in the project. If the directory does not exist, it will be created. The format of this path should respect the directory format of the operating system you are running on. Don't use any special character escaping in the path name either.",
    ),
};

const parametersSchema = z.object(parameters);
export type GetFigmaImagesParams = z.infer<typeof parametersSchema>;

const getFigmaImages = async (params: GetFigmaImagesParams, figmaService: FigmaService) => {
  try {
    const { count, images } = await fetchFigmaAssets(figmaService, params);
    return {
      content: [
        {
          type: "text" as const,
          text: `Downloaded ${count} images:\n${images}`,
        },
      ],
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Failed to download images: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

export const getFigmaImagesTool = {
  name: "get_figma_images",
  description:
    "Download SVG and PNG images used in a Figma file based on the IDs of image or icon nodes",
  parameters,
  execute: getFigmaImages,
}