/**
 * 从Figma数据中提取图片节点信息
 * 用于自动识别需要下载的图片资源
 */

interface ImageNodeInfo {
  nodeId: string;
  fileName: string;
  imageRef?: string;
  needsCropping?: boolean;
  cropTransform?: number[][];
  requiresImageDimensions?: boolean;
  filenameSuffix?: string;
}

/**
 * 从Figma数据中提取图片节点
 */
export function extractImageNodes(figmaDataText: string): ImageNodeInfo[] {
  const imageNodes: ImageNodeInfo[] = [];
  
  try {
    // 尝试解析YAML或JSON格式的数据
    let data: any;
    try {
      // 首先尝试JSON解析
      data = JSON.parse(figmaDataText);
    } catch {
      // 如果JSON解析失败，尝试YAML解析
      const yaml = require('js-yaml');
      data = yaml.load(figmaDataText);
    }

    if (!data || !data.nodes) {
      return imageNodes;
    }

    // 递归遍历节点树，查找图片节点
    function traverseNodes(nodes: any[], parentPath: string = ''): void {
      for (const node of nodes) {
        if (!node || !node.id) continue;

        const nodePath = parentPath ? `${parentPath}_${node.name || node.id}` : (node.name || node.id);
        
        // 检查是否是图片类型节点
        if (isImageNode(node)) {
          const imageInfo = extractImageInfo(node, nodePath);
          if (imageInfo) {
            imageNodes.push(imageInfo);
          }
        }

        // 递归处理子节点
        if (node.children && Array.isArray(node.children)) {
          traverseNodes(node.children, nodePath);
        }
      }
    }

    traverseNodes(data.nodes);
    
  } catch (error) {
    console.warn('提取图片节点时出错:', error);
  }

  return imageNodes;
}

/**
 * 判断节点是否是图片类型
 */
function isImageNode(node: any): boolean {
  if (!node.type) return false;
  
  const imageTypes = [
    'IMAGE-SVG',
    'VECTOR',
    'IMAGE',
    'RECTANGLE', // 可能包含图片填充
    'ELLIPSE',   // 可能包含图片填充
  ];

  // 检查节点类型
  if (imageTypes.includes(node.type)) {
    return true;
  }

  // 检查是否有图片填充
  if (node.fills && Array.isArray(node.fills)) {
    return node.fills.some((fill: any) => 
      fill.type === 'IMAGE' && fill.imageRef
    );
  }

  return false;
}

/**
 * 从图片节点中提取详细信息
 */
function extractImageInfo(node: any, nodePath: string): ImageNodeInfo | null {
  try {
    const baseInfo: ImageNodeInfo = {
      nodeId: node.id,
      fileName: generateFileName(node, nodePath),
      requiresImageDimensions: true,
    };

    // 检查是否有图片填充
    if (node.fills && Array.isArray(node.fills)) {
      const imageFill = node.fills.find((fill: any) => 
        fill.type === 'IMAGE' && fill.imageRef
      );
      
      if (imageFill) {
        baseInfo.imageRef = imageFill.imageRef;
        
        // 检查是否需要裁剪
        if (imageFill.imageTransform && Array.isArray(imageFill.imageTransform)) {
          baseInfo.needsCropping = true;
          baseInfo.cropTransform = imageFill.imageTransform;
        }
      }
    }

    // 检查变换矩阵是否需要裁剪
    if (node.relativeTransform && Array.isArray(node.relativeTransform)) {
      const transform = node.relativeTransform;
      // 如果变换矩阵不是标准的单位矩阵，可能需要裁剪
      if (transform.length === 3 && transform[0].length === 3) {
        const isIdentity = transform[0][0] === 1 && transform[0][1] === 0 && 
                          transform[1][0] === 0 && transform[1][1] === 1;
        if (!isIdentity) {
          baseInfo.needsCropping = true;
          baseInfo.cropTransform = transform;
        }
      }
    }

    return baseInfo;
    
  } catch (error) {
    console.warn('提取图片信息时出错:', error);
    return null;
  }
}

/**
 * 生成图片文件名
 */
function generateFileName(node: any, nodePath: string): string {
  // 清理节点名称，移除特殊字符
  const cleanName = (node.name || nodePath || node.id)
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();

  // 根据节点类型确定文件扩展名
  let extension = '.png'; // 默认PNG
  
  if (node.type === 'IMAGE-SVG' || node.type === 'VECTOR') {
    extension = '.svg';
  }

  // 如果有图片填充，根据填充类型决定
  if (node.fills && Array.isArray(node.fills)) {
    const imageFill = node.fills.find((fill: any) => fill.type === 'IMAGE');
    if (imageFill) {
      // 图片填充通常使用PNG格式
      extension = '.png';
    }
  }

  return `${cleanName}${extension}`;
}

/**
 * 过滤和去重图片节点
 */
export function deduplicateImageNodes(nodes: ImageNodeInfo[]): ImageNodeInfo[] {
  const seen = new Set<string>();
  const result: ImageNodeInfo[] = [];

  for (const node of nodes) {
    // 使用imageRef或nodeId作为去重标识
    const key = node.imageRef || node.nodeId;
    
    if (!seen.has(key)) {
      seen.add(key);
      result.push(node);
    }
  }

  return result;
}

/**
 * 智能提取图片节点，包含去重和过滤
 */
export function smartExtractImageNodes(figmaDataText: string): ImageNodeInfo[] {
  const nodes = extractImageNodes(figmaDataText);
  return deduplicateImageNodes(nodes);
}
