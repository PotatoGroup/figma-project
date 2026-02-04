function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { isVisible } from "./utils/common.js";
import { hasValue } from "./utils/identity.js";
/**
 * Extract data from Figma nodes using a flexible, single-pass approach.
 *
 * @param nodes - The Figma nodes to process
 * @param extractors - Array of extractor functions to apply during traversal
 * @param options - Traversal options (filtering, depth limits, etc.)
 * @param globalVars - Global variables for style deduplication
 * @returns Object containing processed nodes and updated global variables
 */
export function extractFromDesign(nodes, extractors) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var globalVars = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    styles: {}
  };
  var context = {
    globalVars: globalVars,
    currentDepth: 0
  };
  var processedNodes = nodes.filter(function (node) {
    return shouldProcessNode(node, options);
  }).map(function (node) {
    return processNodeWithExtractors(node, extractors, context, options);
  }).filter(function (node) {
    return node !== null;
  });
  return {
    nodes: processedNodes,
    globalVars: context.globalVars
  };
}

/**
 * Process a single node with all provided extractors in one pass.
 */
function processNodeWithExtractors(node, extractors, context, options) {
  if (!shouldProcessNode(node, options)) {
    return null;
  }

  // Always include base metadata
  var result = {
    id: node.id,
    name: node.name,
    type: node.type === "VECTOR" ? "IMAGE-SVG" : node.type
  };

  // Apply all extractors to this node in a single pass
  var _iterator = _createForOfIteratorHelper(extractors),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var extractor = _step.value;
      extractor(node, result, context);
    }

    // Handle children recursively
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (shouldTraverseChildren(context, options)) {
    var childContext = _objectSpread(_objectSpread({}, context), {}, {
      currentDepth: context.currentDepth + 1,
      parent: node
    });

    // Use the same pattern as the existing parseNode function
    if (hasValue("children", node) && node.children.length > 0) {
      var children = node.children.filter(function (child) {
        return shouldProcessNode(child, options);
      }).map(function (child) {
        return processNodeWithExtractors(child, extractors, childContext, options);
      }).filter(function (child) {
        return child !== null;
      });
      if (children.length > 0) {
        result.children = children;
      }
    }
  }
  return result;
}

/**
 * Determine if a node should be processed based on filters.
 */
function shouldProcessNode(node, options) {
  // Skip invisible nodes
  if (!isVisible(node)) {
    return false;
  }

  // Apply custom node filter if provided
  if (options.nodeFilter && !options.nodeFilter(node)) {
    return false;
  }
  return true;
}

/**
 * Determine if we should traverse into a node's children.
 */
function shouldTraverseChildren(context, options) {
  // Check depth limit
  if (options.maxDepth !== undefined && context.currentDepth >= options.maxDepth) {
    return false;
  }
  return true;
}