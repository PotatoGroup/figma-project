import { createServer } from './service'
import { config } from 'dotenv'
import { resolve } from 'path'
import { getServerConfig } from './config';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

config({ path: resolve(process.cwd(), ".env") });

const startServer = async () => {
  const config = await getServerConfig();
  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

if (process.argv[1]) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}