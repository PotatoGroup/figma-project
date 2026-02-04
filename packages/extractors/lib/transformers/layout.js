"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSimplifiedLayout = buildSimplifiedLayout;
var _identity = require("../utils/identity.js");
var _common = require("../utils/common.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Convert Figma's layout config into a more typical flex-like schema
function buildSimplifiedLayout(n, parent) {
  var frameValues = buildSimplifiedFrameValues(n);
  var layoutValues = buildSimplifiedLayoutValues(n, parent, frameValues.mode) || {};
  return _objectSpread(_objectSpread({}, frameValues), layoutValues);
}

// For flex layouts, process alignment and sizing
function convertAlign(axisAlign, stretch) {
  if (stretch && stretch.mode !== "none") {
    var children = stretch.children,
      mode = stretch.mode,
      axis = stretch.axis;

    // Compute whether to check horizontally or vertically based on axis and direction
    var direction = getDirection(axis, mode);
    var shouldStretch = children.length > 0 && children.reduce(function (shouldStretch, c) {
      if (!shouldStretch) return false;
      if ("layoutPositioning" in c && c.layoutPositioning === "ABSOLUTE") return true;
      if (direction === "horizontal") {
        return "layoutSizingHorizontal" in c && c.layoutSizingHorizontal === "FILL";
      } else if (direction === "vertical") {
        return "layoutSizingVertical" in c && c.layoutSizingVertical === "FILL";
      }
      return false;
    }, true);
    if (shouldStretch) return "stretch";
  }
  switch (axisAlign) {
    case "MIN":
      // MIN, AKA flex-start, is the default alignment
      return undefined;
    case "MAX":
      return "flex-end";
    case "CENTER":
      return "center";
    case "SPACE_BETWEEN":
      return "space-between";
    case "BASELINE":
      return "baseline";
    default:
      return undefined;
  }
}
function convertSelfAlign(align) {
  switch (align) {
    case "MIN":
      // MIN, AKA flex-start, is the default alignment
      return undefined;
    case "MAX":
      return "flex-end";
    case "CENTER":
      return "center";
    case "STRETCH":
      return "stretch";
    default:
      return undefined;
  }
}

// interpret sizing
function convertSizing(s) {
  if (s === "FIXED") return "fixed";
  if (s === "FILL") return "fill";
  if (s === "HUG") return "hug";
  return undefined;
}
function getDirection(axis, mode) {
  switch (axis) {
    case "primary":
      switch (mode) {
        case "row":
          return "horizontal";
        case "column":
          return "vertical";
      }
    case "counter":
      switch (mode) {
        case "row":
          return "horizontal";
        case "column":
          return "vertical";
      }
  }
}
function buildSimplifiedFrameValues(n) {
  var _n$overflowDirection, _n$overflowDirection2, _n$primaryAxisAlignIt, _n$counterAxisAlignIt, _n$itemSpacing;
  if (!(0, _identity.isFrame)(n)) {
    return {
      mode: "none"
    };
  }
  var frameValues = {
    mode: !n.layoutMode || n.layoutMode === "NONE" ? "none" : n.layoutMode === "HORIZONTAL" ? "row" : "column"
  };
  var overflowScroll = [];
  if ((_n$overflowDirection = n.overflowDirection) !== null && _n$overflowDirection !== void 0 && _n$overflowDirection.includes("HORIZONTAL")) overflowScroll.push("x");
  if ((_n$overflowDirection2 = n.overflowDirection) !== null && _n$overflowDirection2 !== void 0 && _n$overflowDirection2.includes("VERTICAL")) overflowScroll.push("y");
  if (overflowScroll.length > 0) frameValues.overflowScroll = overflowScroll;
  if (frameValues.mode === "none") {
    return frameValues;
  }

  // TODO: convertAlign should be two functions, one for justifyContent and one for alignItems
  frameValues.justifyContent = convertAlign((_n$primaryAxisAlignIt = n.primaryAxisAlignItems) !== null && _n$primaryAxisAlignIt !== void 0 ? _n$primaryAxisAlignIt : "MIN", {
    children: n.children,
    axis: "primary",
    mode: frameValues.mode
  });
  frameValues.alignItems = convertAlign((_n$counterAxisAlignIt = n.counterAxisAlignItems) !== null && _n$counterAxisAlignIt !== void 0 ? _n$counterAxisAlignIt : "MIN", {
    children: n.children,
    axis: "counter",
    mode: frameValues.mode
  });
  frameValues.alignSelf = convertSelfAlign(n.layoutAlign);

  // Only include wrap if it's set to WRAP, since flex layouts don't default to wrapping
  frameValues.wrap = n.layoutWrap === "WRAP" ? true : void 0;
  frameValues.gap = n.itemSpacing ? "".concat((_n$itemSpacing = n.itemSpacing) !== null && _n$itemSpacing !== void 0 ? _n$itemSpacing : 0, "px") : undefined;
  // gather padding
  if (n.paddingTop || n.paddingBottom || n.paddingLeft || n.paddingRight) {
    var _n$paddingTop, _n$paddingRight, _n$paddingBottom, _n$paddingLeft;
    frameValues.padding = (0, _common.generateCSSShorthand)({
      top: (_n$paddingTop = n.paddingTop) !== null && _n$paddingTop !== void 0 ? _n$paddingTop : 0,
      right: (_n$paddingRight = n.paddingRight) !== null && _n$paddingRight !== void 0 ? _n$paddingRight : 0,
      bottom: (_n$paddingBottom = n.paddingBottom) !== null && _n$paddingBottom !== void 0 ? _n$paddingBottom : 0,
      left: (_n$paddingLeft = n.paddingLeft) !== null && _n$paddingLeft !== void 0 ? _n$paddingLeft : 0
    });
  }
  return frameValues;
}
function buildSimplifiedLayoutValues(n, parent, mode) {
  if (!(0, _identity.isLayout)(n)) return undefined;
  var layoutValues = {
    mode: mode
  };
  layoutValues.sizing = {
    horizontal: convertSizing(n.layoutSizingHorizontal),
    vertical: convertSizing(n.layoutSizingVertical)
  };

  // Only include positioning-related properties if parent layout isn't flex or if the node is absolute
  if (
  // If parent is a frame but not an AutoLayout, or if the node is absolute, include positioning-related properties
  (0, _identity.isFrame)(parent) && !(0, _identity.isInAutoLayoutFlow)(n, parent)) {
    if (n.layoutPositioning === "ABSOLUTE") {
      layoutValues.position = "absolute";
    }
    if (n.absoluteBoundingBox && parent.absoluteBoundingBox) {
      layoutValues.locationRelativeToParent = {
        x: (0, _common.pixelRound)(n.absoluteBoundingBox.x - parent.absoluteBoundingBox.x),
        y: (0, _common.pixelRound)(n.absoluteBoundingBox.y - parent.absoluteBoundingBox.y)
      };
    }
  }

  // Handle dimensions based on layout growth and alignment
  if ((0, _identity.isRectangle)("absoluteBoundingBox", n)) {
    var dimensions = {};

    // Only include dimensions that aren't meant to stretch
    if (mode === "row") {
      // AutoLayout row, only include dimensions if the node is not growing
      if (!n.layoutGrow && n.layoutSizingHorizontal == "FIXED") dimensions.width = n.absoluteBoundingBox.width;
      if (n.layoutAlign !== "STRETCH" && n.layoutSizingVertical == "FIXED") dimensions.height = n.absoluteBoundingBox.height;
    } else if (mode === "column") {
      // AutoLayout column, only include dimensions if the node is not growing
      if (n.layoutAlign !== "STRETCH" && n.layoutSizingHorizontal == "FIXED") dimensions.width = n.absoluteBoundingBox.width;
      if (!n.layoutGrow && n.layoutSizingVertical == "FIXED") dimensions.height = n.absoluteBoundingBox.height;
      if (n.preserveRatio) {
        var _n$absoluteBoundingBo, _n$absoluteBoundingBo2;
        dimensions.aspectRatio = ((_n$absoluteBoundingBo = n.absoluteBoundingBox) === null || _n$absoluteBoundingBo === void 0 ? void 0 : _n$absoluteBoundingBo.width) / ((_n$absoluteBoundingBo2 = n.absoluteBoundingBox) === null || _n$absoluteBoundingBo2 === void 0 ? void 0 : _n$absoluteBoundingBo2.height);
      }
    } else {
      // Node is not an AutoLayout. Include dimensions if the node is not growing (which it should never be)
      if (!n.layoutSizingHorizontal || n.layoutSizingHorizontal === "FIXED") {
        dimensions.width = n.absoluteBoundingBox.width;
      }
      if (!n.layoutSizingVertical || n.layoutSizingVertical === "FIXED") {
        dimensions.height = n.absoluteBoundingBox.height;
      }
    }
    if (Object.keys(dimensions).length > 0) {
      if (dimensions.width) {
        dimensions.width = (0, _common.pixelRound)(dimensions.width);
      }
      if (dimensions.height) {
        dimensions.height = (0, _common.pixelRound)(dimensions.height);
      }
      layoutValues.dimensions = dimensions;
    }
  }
  return layoutValues;
}