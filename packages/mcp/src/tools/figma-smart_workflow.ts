import { z } from 'zod'
import { parseFigmaUrl, smartExtractImageNodes } from '@figma-project/extractors'
import type { FigmaService } from '@figma-project/service'
import path from 'path'
import { getFigmaDataTool } from './get_figma_data'
import { getFigmaImagesTool } from './get_figma_images'
import { reactComponentGeneratorTool } from './react_component_generator'
import type { GetFigmaDataParams } from './get_figma_data'
import type { GetFigmaImagesParams } from './get_figma_images'
import type { ReactComponentGeneratorParams } from './react_component_generator'

const parameters = {
  figmaUrl: z
    .string()
    .describe("Figma设计文件的URL地址，支持file和design链接格式"),
  componentName: z
    .string()
    .optional()
    .describe("生成的React组件名称，如果不提供将从Figma文件名自动生成"),
  outputPath: z
    .string()
    .optional()
    .describe("组件代码输出路径，默认为./components/[componentName]"),
  imageOutputPath: z
    .string()
    .optional()
    .describe("图片资源输出路径，默认为./assets"),
  includeImages: z
    .boolean()
    .optional()
    .default(true)
    .describe("是否下载和处理图片资源"),
  depth: z
    .number()
    .optional()
    .describe("Figma节点遍历深度，默认为10"),
  json: z
    .boolean()
    .optional()
    .default(false)
    .describe("是否输出JSON格式，默认为YAML格式"),
};

const parametersSchema = z.object(parameters);
export type FigmaSmartWorkflowParams = z.infer<typeof parametersSchema>;

/**
 * Figma工作流编排器
 * 自动化执行：解析URL -> 获取数据 -> 下载图片 -> 生成React组件
 */
const figmaSmartWorkflow = async (
  params: FigmaSmartWorkflowParams,
  figmaService: FigmaService,
  outputFormat: "yaml" | "json" = "yaml"
) => {
  try {
    const {
      figmaUrl,
      componentName,
      outputPath = path.join(process.cwd(), 'components', componentName || ''),
      imageOutputPath = path.join(process.cwd(), 'assets'),
      includeImages = true,
      depth = 10
    } = params;

    // 步骤1: 解析Figma URL
    const urlInfo = parseFigmaUrl(figmaUrl);
    if (!urlInfo.isValid) {
      return {
        isError: true,
        content: [{
          type: "text" as const,
          text: `无效的Figma URL: ${figmaUrl}\n请提供有效的Figma文件或设计链接`
        }]
      };
    }

    const workflowSteps: string[] = [];
    let imageData: any;

    // 步骤2: 获取Figma数据
    workflowSteps.push("🔍 正在获取Figma设计数据...");
    const figmaDataParams: GetFigmaDataParams = {
      fileKey: urlInfo.fileKey,
      nodeId: urlInfo.nodeId,
      depth
    };

    const figmaData = await getFigmaDataTool.execute(figmaDataParams, figmaService, outputFormat);

    if (figmaData.isError) {
      return {
        isError: true,
        content: [{
          type: "text" as const,
          text: `获取Figma数据失败: ${figmaData.content[0]?.text || '未知错误'}`
        }]
      };
    }
    workflowSteps.push("✅ Figma设计数据获取成功");

    // 步骤3: 处理图片资源（如果需要）
    if (includeImages) {
      workflowSteps.push("🖼️ 正在分析和下载图片资源...");

      try {
        // 从Figma数据中提取图片节点
        const imageNodes = smartExtractImageNodes(figmaData.content[0]?.text || '');

        if (imageNodes.length > 0) {
          const figmaImagesParams: GetFigmaImagesParams = {
            fileKey: urlInfo.fileKey,
            nodes: imageNodes,
            localPath: path.resolve(imageOutputPath),
            pngScale: 2
          };

          imageData = await getFigmaImagesTool.execute(figmaImagesParams, figmaService);

          if (imageData.isError) {
            workflowSteps.push("⚠️ 图片下载失败，将继续生成组件代码");
            imageData = { content: [{ type: "text", text: "图片下载失败" }] };
          } else {
            workflowSteps.push("✅ 图片资源下载成功");
          }
        } else {
          workflowSteps.push("ℹ️ 未发现需要下载的图片资源");
          imageData = { content: [{ type: "text", text: "无图片资源" }] };
        }
      } catch (error) {
        workflowSteps.push("⚠️ 图片处理出现问题，将继续生成组件代码");
        imageData = { content: [{ type: "text", text: `图片处理错误: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    } else {
      imageData = { content: [{ type: "text", text: "已跳过图片下载" }] };
      workflowSteps.push("⏭️ 已跳过图片下载步骤");
    }

    // 步骤4: 定义React组件代码规则
    workflowSteps.push("⚛️ 定义React组件代码生成规则...");

    const reactComponentParams: ReactComponentGeneratorParams = {
      figma_data: figmaData.content[0]?.text || '',
      figma_images: imageData.content[0]?.text || ''
    };

    const rules = await reactComponentGeneratorTool.execute(reactComponentParams);
    workflowSteps.push("✅ React组件代码生成完成");

    const finalComponentName = componentName || urlInfo.fileName?.replace(/[^a-zA-Z0-9]/g, '') || 'FigmaComponent';

    return {
      content: [{
        type: "text" as const,
        text: `# Figma到React组件转换工作流

## 工作流执行步骤
${workflowSteps.map(step => `- ${step}`).join('\n')}

## 组件信息
- **组件名称**: ${finalComponentName}
- **Figma文件**: ${urlInfo.fileName || 'Unknown'}
- **文件Key**: ${urlInfo.fileKey}
${urlInfo.nodeId ? `- **节点ID**: ${urlInfo.nodeId}` : ''}
- **输出路径**: ${outputPath}
${includeImages ? `- **图片路径**: ${imageOutputPath}` : ''}

## Figma数据和规则定义

${rules.content[0]?.text || ''}

`}]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `工作流执行失败: ${errorMessage}\n\n请检查：\n1. Figma URL是否正确\n2. Figma API Token是否有效\n3. 网络连接是否正常\n4. 输出路径是否有写入权限`
      }]
    };
  }
};

export const figmaSmartWorkflowTool = {
  name: "FigmaSmartWorkflow",
  description: "A complete workflow that automatically retrieves design data, downloads image resources, and generates React component code based on the Figma URL entered by the user (preferred).",
  parameters,
  execute: figmaSmartWorkflow,
};
