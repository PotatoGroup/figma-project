import { config as loadEnv } from "dotenv";
import { resolve } from "path";

interface ServerConfig {
  figmaApiKey: string;
  port: number;
  outputFormat: "yaml" | "json";
  includeImages?: boolean;
}

interface CliArgs {
  "figma-api-key"?: string;
  env?: string;
  port?: number;
  json?: boolean;
  "include-images"?: boolean;
}

export async function getServerConfig(): Promise<ServerConfig> {
  const [yargs, hideBin] = await Promise.all([import("yargs").then(({ default: yargs }) => yargs), import('yargs/helpers').then(({ hideBin }) => hideBin)])
  const argv = yargs(hideBin(process.argv))
    .options({
      "figma-api-key": {
        type: "string",
        description: "Figma API Key (Personal Access Token)",
      },
      env: {
        type: "string",
        description: "Path to custom .env file to load environment variables from",
      },
      port: {
        type: "number",
        description: "Port to run the server on",
      },
      json: {
        type: "boolean",
        description: "Output data from tools in JSON format instead of YAML",
        default: false,
      },
      "include-images": {
        type: "boolean",
        description: "Include images in the output",
        default: true,
      },
    })
    .help()
    .version(process.env['NPM_PACKAGE_VERSION'] ?? "unknown")
    .parseSync() as CliArgs;

  let envFilePath: string;

  if (argv["env"]) {
    envFilePath = resolve(argv["env"]);
  } else {
    envFilePath = resolve(process.cwd(), '.env');
  }

  loadEnv({ path: envFilePath, override: true });

  const config: ServerConfig = {
    figmaApiKey: "",
    port: 3333,
    outputFormat: "yaml",
    includeImages: true,
  };

  if (argv["figma-api-key"]) {
    config.figmaApiKey = argv["figma-api-key"];
  } else if (process.env['FIGMA_API_KEY']) {
    config.figmaApiKey = process.env['FIGMA_API_KEY'];
  }

  if (argv.port) {
    config.port = argv.port;
  } else if (process.env['PORT']) {
    config.port = parseInt(process.env['PORT'], 10);
  }

  if (argv.json) {
    config.outputFormat = "json";
  } else if (process.env['OUTPUT_FORMAT']) {
    config.outputFormat = process.env['OUTPUT_FORMAT'] as "yaml" | "json";
  }

  if (argv["include-images"]) {
    config.includeImages = true;
  } else if (process.env['INCLUDE_IMAGES'] === "true") {
    config.includeImages = true;
  }

  if (!config.figmaApiKey) {
    console.error(`
❌ Figma API Key is required!

Please provide it via:
1. Command line: --figma-api-key=YOUR_TOKEN
2. Environment variable: FIGMA_API_KEY=YOUR_TOKEN
3. .env file: FIGMA_API_KEY=YOUR_TOKEN

Get your token at: https://www.figma.com/developers/api#access-tokens
`);
    process.exit(1);
  }
  return config;
}
