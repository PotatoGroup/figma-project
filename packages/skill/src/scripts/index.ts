import { startFigmaService } from './workflow';

const args = process.argv.slice(2);
const figmaUrl = args[0];

const HELP = `ant-figma-skill - Figma 设计数据获取 CLI

用法:
  ant-figma-skill <Figma URL>
  node scripts/index.js <Figma URL>

选项:
  -h, --help    显示此帮助信息

示例:
  ant-figma-skill "https://www.figma.com/design/xxx/xxx?node-id=420-1267"
  node scripts/index.js "https://www.figma.com/design/xxx/xxx?node-id=420-1267"

环境变量:
  FIGMA_API_KEY  Figma API Token（需在 .env 或环境变量中配置）
`;

if (!figmaUrl || args.includes('-h') || args.includes('--help')) {
  if (!figmaUrl) {
    console.error('请提供有效的 Figma URL\n');
  }
  console.log(HELP);
  process.exit(figmaUrl ? 0 : 1);
}

startFigmaService(figmaUrl)
  .then(({ assetsPath }) => {
    console.log(assetsPath);
  })
  .catch((err) => {
    console.error('Figma 流程执行失败:', err?.message || err);
    process.exit(1);
  });
