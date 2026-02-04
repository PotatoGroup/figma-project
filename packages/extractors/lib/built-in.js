"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visualsOnly = exports.visualsExtractor = exports.textExtractor = exports.layoutOnly = exports.layoutExtractor = exports.layoutAndText = exports.contentOnly = exports.componentExtractor = exports.allExtractors = void 0;
var _layout = require("./transformers/layout.js");
var _style = require("./transformers/style.js");
var _effects = require("./transformers/effects.js");
var _text = require("./transformers/text.js");
var _identity = require("./utils/identity.js");
var _common = require("./utils/common.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * Helper function to find or create a global variable.
 */
function findOrCreateVar(globalVars, value, prefix) {
  var _Object$entries$find;
  // Check if the same value already exists
  var _ref = (_Object$entries$find = Object.entries(globalVars.styles).find(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        _ = _ref4[0],
        existingValue = _ref4[1];
      return JSON.stringify(existingValue) === JSON.stringify(value);
    })) !== null && _Object$entries$find !== void 0 ? _Object$entries$find : [],
    _ref2 = _slicedToArray(_ref, 1),
    existingVarId = _ref2[0];
  if (existingVarId) {
    return existingVarId;
  }

  // Create a new variable if it doesn't exist
  var varId = (0, _common.generateVarId)(prefix);
  globalVars.styles[varId] = value;
  return varId;
}

/**
 * Extracts layout-related properties from a node.
 */
var layoutExtractor = exports.layoutExtractor = function layoutExtractor(node, result, context) {
  var layout = (0, _layout.buildSimplifiedLayout)(node, context.parent);
  if (Object.keys(layout).length > 1) {
    result.layout = findOrCreateVar(context.globalVars, layout, "layout");
  }
};

/**
 * Extracts text content and text styling from a node.
 */
var textExtractor = exports.textExtractor = function textExtractor(node, result, context) {
  // Extract text content
  if ((0, _text.isTextNode)(node)) {
    var _extractNodeText;
    result.text = (_extractNodeText = (0, _text.extractNodeText)(node)) !== null && _extractNodeText !== void 0 ? _extractNodeText : "";
  }

  // Extract text style
  if ((0, _text.hasTextStyle)(node)) {
    var textStyle = (0, _text.extractTextStyle)(node);
    result.textStyle = findOrCreateVar(context.globalVars, textStyle, "style");
  }
};

/**
 * Extracts visual appearance properties (fills, strokes, effects, opacity, border radius).
 */
var visualsExtractor = exports.visualsExtractor = function visualsExtractor(node, result, context) {
  // Check if node has children to determine CSS properties
  var hasChildren = (0, _identity.hasValue)("children", node) && Array.isArray(node.children) && node.children.length > 0;

  // fills
  if ((0, _identity.hasValue)("fills", node) && Array.isArray(node.fills) && node.fills.length) {
    var fills = node.fills.map(function (fill) {
      return (0, _style.parsePaint)(fill, hasChildren);
    }).reverse();
    result.fills = findOrCreateVar(context.globalVars, fills, "fill");
  }

  // strokes
  var strokes = (0, _style.buildSimplifiedStrokes)(node, hasChildren);
  if (strokes.colors.length) {
    result.strokes = findOrCreateVar(context.globalVars, strokes, "stroke");
  }

  // effects
  var effects = (0, _effects.buildSimplifiedEffects)(node);
  if (Object.keys(effects).length) {
    result.effects = findOrCreateVar(context.globalVars, effects, "effect");
  }

  // opacity
  if ((0, _identity.hasValue)("opacity", node) && typeof node.opacity === "number" && node.opacity !== 1) {
    result.opacity = node.opacity;
  }

  // border radius
  if ((0, _identity.hasValue)("cornerRadius", node) && typeof node.cornerRadius === "number") {
    result.borderRadius = "".concat(node.cornerRadius, "px");
  }
  if ((0, _identity.hasValue)("rectangleCornerRadii", node, _identity.isRectangleCornerRadii)) {
    result.borderRadius = "".concat(node.rectangleCornerRadii[0], "px ").concat(node.rectangleCornerRadii[1], "px ").concat(node.rectangleCornerRadii[2], "px ").concat(node.rectangleCornerRadii[3], "px");
  }
};

/**
 * Extracts component-related properties from INSTANCE nodes.
 */
var componentExtractor = exports.componentExtractor = function componentExtractor(node, result) {
  if (node.type === "INSTANCE") {
    if ((0, _identity.hasValue)("componentId", node)) {
      result.componentId = node.componentId;
    }

    // Add specific properties for instances of components
    if ((0, _identity.hasValue)("componentProperties", node)) {
      var _node$componentProper;
      result.componentProperties = Object.entries((_node$componentProper = node.componentProperties) !== null && _node$componentProper !== void 0 ? _node$componentProper : {}).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          name = _ref6[0],
          _ref6$ = _ref6[1],
          value = _ref6$.value,
          type = _ref6$.type;
        return {
          name: name,
          value: value.toString(),
          type: type
        };
      });
    }
  }
};

// -------------------- CONVENIENCE COMBINATIONS --------------------

/**
 * All extractors - replicates the current parseNode behavior.
 */
var allExtractors = exports.allExtractors = [layoutExtractor, textExtractor, visualsExtractor, componentExtractor];

/**
 * Layout and text only - useful for content analysis and layout planning.
 */
var layoutAndText = exports.layoutAndText = [layoutExtractor, textExtractor];

/**
 * Text content only - useful for content audits and copy extraction.
 */
var contentOnly = exports.contentOnly = [textExtractor];

/**
 * Visuals only - useful for design system analysis and style extraction.
 */
var visualsOnly = exports.visualsOnly = [visualsExtractor];

/**
 * Layout only - useful for structure analysis.
 */
var layoutOnly = exports.layoutOnly = [layoutExtractor];