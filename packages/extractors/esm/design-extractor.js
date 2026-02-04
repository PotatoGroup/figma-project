function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { simplifyComponents, simplifyComponentSets } from "./transformers/component.js";
import { isVisible } from "./utils/common.js";
import { extractFromDesign } from "./node-walker.js";

/**
 * Extract a complete SimplifiedDesign from raw Figma API response using extractors.
 */
export function simplifyRawFigmaObject(apiResponse, nodeExtractors) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Extract components, componentSets, and raw nodes from API response
  var _parseAPIResponse = parseAPIResponse(apiResponse),
    metadata = _parseAPIResponse.metadata,
    rawNodes = _parseAPIResponse.rawNodes,
    components = _parseAPIResponse.components,
    componentSets = _parseAPIResponse.componentSets;

  // Process nodes using the flexible extractor system
  var globalVars = {
    styles: {}
  };
  var _extractFromDesign = extractFromDesign(rawNodes, nodeExtractors, options, globalVars),
    extractedNodes = _extractFromDesign.nodes,
    finalGlobalVars = _extractFromDesign.globalVars;

  // Return complete design
  return _objectSpread(_objectSpread({}, metadata), {}, {
    nodes: extractedNodes,
    components: simplifyComponents(components),
    componentSets: simplifyComponentSets(componentSets),
    globalVars: finalGlobalVars
  });
}

/**
 * Parse the raw Figma API response to extract metadata, nodes, and components.
 */
function parseAPIResponse(data) {
  var aggregatedComponents = {};
  var aggregatedComponentSets = {};
  var nodesToParse;
  if ("nodes" in data) {
    // GetFileNodesResponse
    var nodeResponses = Object.values(data.nodes);
    nodeResponses.forEach(function (nodeResponse) {
      if (nodeResponse.components) {
        Object.assign(aggregatedComponents, nodeResponse.components);
      }
      if (nodeResponse.componentSets) {
        Object.assign(aggregatedComponentSets, nodeResponse.componentSets);
      }
    });
    nodesToParse = nodeResponses.map(function (n) {
      return n.document;
    }).filter(isVisible);
  } else {
    // GetFileResponse
    Object.assign(aggregatedComponents, data.components);
    Object.assign(aggregatedComponentSets, data.componentSets);
    nodesToParse = data.document.children.filter(isVisible);
  }
  var name = data.name,
    lastModified = data.lastModified,
    thumbnailUrl = data.thumbnailUrl;
  return {
    metadata: {
      name: name,
      lastModified: lastModified,
      thumbnailUrl: thumbnailUrl || ""
    },
    rawNodes: nodesToParse,
    components: aggregatedComponents,
    componentSets: aggregatedComponentSets
  };
}