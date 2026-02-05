import { startFigmaService } from './workflow';
const figmaUrl = process.argv[2];
if (!figmaUrl) {
  console.error('请提供有效的Figma URL');
  process.exit(1);
}
startFigmaService(figmaUrl);
