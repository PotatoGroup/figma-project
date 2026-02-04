"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deduplicateImageNodes = deduplicateImageNodes;
exports.extractImageNodes = extractImageNodes;
exports.smartExtractImageNodes = smartExtractImageNodes;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * 从Figma数据中提取图片节点信息
 * 用于自动识别需要下载的图片资源
 */

/**
 * 从Figma数据中提取图片节点
 */
function extractImageNodes(figmaDataText) {
  var imageNodes = [];
  try {
    // 尝试解析YAML或JSON格式的数据
    var data;
    try {
      // 首先尝试JSON解析
      data = JSON.parse(figmaDataText);
    } catch (_unused) {
      // 如果JSON解析失败，尝试YAML解析
      var yaml = require('js-yaml');
      data = yaml.load(figmaDataText);
    }
    if (!data || !data.nodes) {
      return imageNodes;
    }

    // 递归遍历节点树，查找图片节点
    function traverseNodes(nodes) {
      var parentPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var _iterator = _createForOfIteratorHelper(nodes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;
          if (!node || !node.id) continue;
          var nodePath = parentPath ? "".concat(parentPath, "_").concat(node.name || node.id) : node.name || node.id;

          // 检查是否是图片类型节点
          if (isImageNode(node)) {
            var imageInfo = extractImageInfo(node, nodePath);
            if (imageInfo) {
              imageNodes.push(imageInfo);
            }
          }

          // 递归处理子节点
          if (node.children && Array.isArray(node.children)) {
            traverseNodes(node.children, nodePath);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
function isImageNode(node) {
  if (!node.type) return false;
  var imageTypes = ['IMAGE-SVG', 'VECTOR', 'IMAGE', 'RECTANGLE',
  // 可能包含图片填充
  'ELLIPSE' // 可能包含图片填充
  ];

  // 检查节点类型
  if (imageTypes.includes(node.type)) {
    return true;
  }

  // 检查是否有图片填充
  if (node.fills && Array.isArray(node.fills)) {
    return node.fills.some(function (fill) {
      return fill.type === 'IMAGE' && fill.imageRef;
    });
  }
  return false;
}

/**
 * 从图片节点中提取详细信息
 */
function extractImageInfo(node, nodePath) {
  try {
    var baseInfo = {
      nodeId: node.id,
      fileName: generateFileName(node, nodePath),
      requiresImageDimensions: true
    };

    // 检查是否有图片填充
    if (node.fills && Array.isArray(node.fills)) {
      var imageFill = node.fills.find(function (fill) {
        return fill.type === 'IMAGE' && fill.imageRef;
      });
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
      var transform = node.relativeTransform;
      // 如果变换矩阵不是标准的单位矩阵，可能需要裁剪
      if (transform.length === 3 && transform[0].length === 3) {
        var isIdentity = transform[0][0] === 1 && transform[0][1] === 0 && transform[1][0] === 0 && transform[1][1] === 1;
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
function generateFileName(node, nodePath) {
  // 清理节点名称，移除特殊字符
  var cleanName = (node.name || nodePath || node.id).replace(/[^a-zA-Z0-9\-_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toLowerCase();

  // 根据节点类型确定文件扩展名
  var extension = '.png'; // 默认PNG

  if (node.type === 'IMAGE-SVG' || node.type === 'VECTOR') {
    extension = '.svg';
  }

  // 如果有图片填充，根据填充类型决定
  if (node.fills && Array.isArray(node.fills)) {
    var imageFill = node.fills.find(function (fill) {
      return fill.type === 'IMAGE';
    });
    if (imageFill) {
      // 图片填充通常使用PNG格式
      extension = '.png';
    }
  }
  return "".concat(cleanName).concat(extension);
}

/**
 * 过滤和去重图片节点
 */
function deduplicateImageNodes(nodes) {
  var seen = new Set();
  var result = [];
  var _iterator2 = _createForOfIteratorHelper(nodes),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var node = _step2.value;
      // 使用imageRef或nodeId作为去重标识
      var key = node.imageRef || node.nodeId;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(node);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return result;
}

/**
 * 智能提取图片节点，包含去重和过滤
 */
function smartExtractImageNodes(figmaDataText) {
  var nodes = extractImageNodes(figmaDataText);
  return deduplicateImageNodes(nodes);
}