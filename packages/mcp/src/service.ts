import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FigmaService } from '@figma-project/service'
import { figmaSmartWorkflowTool } from './tools'
import type { FigmaSmartWorkflowParams } from './tools'


type CreateServerOptions = {
  outputFormat: "yaml" | "json";
  includeImages?: boolean;
  figmaApiKey: string;
}

export const createServer = (options: CreateServerOptions) => {
  const mcpServer = new McpServer({
    name: "Figma MCP Server",
    version: process.env["NPM_PACKAGE_VERSION"] ?? "unknown",
  });
  const figmaServer = new FigmaService(options.figmaApiKey);
  registerTools(mcpServer, figmaServer, options);
  return mcpServer;
}

const registerTools = (mcpServer: McpServer, figmaService: FigmaService, options: Omit<CreateServerOptions, "figmaApiKey">) => {
  const { outputFormat } = options;

  /**
   * Register the Figma Smart Workflow tool
   * @param mcpServer - The MCP server instance
   * @param figmaService - The Figma service instance
   * @param options - The options for the server
   * @returns The MCP server instance
   */
  mcpServer.registerTool(
    figmaSmartWorkflowTool.name,
    {
      description: figmaSmartWorkflowTool.description,
      inputSchema: figmaSmartWorkflowTool.parameters,
    },
    (args) => figmaSmartWorkflowTool.execute({ ...args, ...options } as FigmaSmartWorkflowParams, figmaService, outputFormat) as any
  );
}