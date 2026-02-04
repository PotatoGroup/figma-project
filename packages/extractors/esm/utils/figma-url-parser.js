function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * Figma URL解析工具
 * 支持解析各种Figma URL格式，提取fileKey和nodeId
 */

/**
 * 解析Figma URL，提取fileKey和nodeId
 * 支持的URL格式：
 * - https://www.figma.com/file/{fileKey}/{fileName}
 * - https://www.figma.com/design/{fileKey}/{fileName}  
 * - https://www.figma.com/file/{fileKey}/{fileName}?node-id={nodeId}
 * - https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}
 */
export function parseFigmaUrl(url) {
  var result = {
    fileKey: '',
    nodeId: undefined,
    fileName: undefined,
    isValid: false,
    originalUrl: url
  };
  try {
    var urlObj = new URL(url);

    // 检查是否是Figma域名
    if (!urlObj.hostname.includes('figma.com')) {
      return result;
    }

    // 解析路径：/file/{fileKey}/{fileName} 或 /design/{fileKey}/{fileName}
    var pathMatch = urlObj.pathname.match(/\/(file|design)\/([a-zA-Z0-9]+)(?:\/([^\/]+))?/);
    if (!pathMatch) {
      return result;
    }
    var _pathMatch = _slicedToArray(pathMatch, 4),
      fileKey = _pathMatch[2],
      fileName = _pathMatch[3];
    result.fileKey = fileKey;
    result.fileName = fileName ? decodeURIComponent(fileName) : undefined;

    // 解析node-id参数
    var nodeIdParam = urlObj.searchParams.get('node-id');
    if (nodeIdParam) {
      // 处理URL编码的node-id，如：1%3A2 -> 1:2
      result.nodeId = decodeURIComponent(nodeIdParam);
    }
    result.isValid = !!fileKey;
    return result;
  } catch (error) {
    return result;
  }
}

/**
 * 验证Figma URL是否有效
 */
export function isValidFigmaUrl(url) {
  return parseFigmaUrl(url).isValid;
}

/**
 * 从文本中提取Figma URL
 */
export function extractFigmaUrls(text) {
  var figmaUrlRegex = /https?:\/\/(?:www\.)?figma\.com\/(?:file|design)\/[a-zA-Z0-9]+(?:\/[^?\s]*)?(?:\?[^\s]*)*/g;
  return text.match(figmaUrlRegex) || [];
}

/**
 * 智能解析用户输入，提取Figma URL信息
 */
export function smartParseFigmaInput(input) {
  var urls = extractFigmaUrls(input);
  return urls.map(parseFigmaUrl).filter(function (info) {
    return info.isValid;
  });
}