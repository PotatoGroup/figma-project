import { startFigmaService } from './workflow';

const figmaUrl = process.argv[2];
if (!figmaUrl) {
  console.error('请提供有效的Figma URL');
  process.exit(1);
}

startFigmaService(figmaUrl)
  .then(({ assetsPath }) => {
    console.log(assetsPath);
  })
  .catch((err) => {
    console.error('Figma 流程执行失败:', err?.message || err);
    process.exit(1);
  });
