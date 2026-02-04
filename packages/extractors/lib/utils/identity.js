"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasValue = hasValue;
exports.isCSSColorValue = isCSSColorValue;
exports.isFrame = isFrame;
exports.isInAutoLayoutFlow = isInAutoLayoutFlow;
exports.isLayout = isLayout;
exports.isRectangle = isRectangle;
exports.isRectangleCornerRadii = isRectangleCornerRadii;
exports.isStrokeWeights = isStrokeWeights;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function hasValue(key, obj, typeGuard) {
  var isObject = _typeof(obj) === "object" && obj !== null;
  if (!isObject || !(key in obj)) return false;
  var val = obj[key];
  return typeGuard ? typeGuard(val) : val !== undefined;
}
function isFrame(val) {
  return _typeof(val) === "object" && !!val && "clipsContent" in val && typeof val.clipsContent === "boolean";
}
function isLayout(val) {
  return _typeof(val) === "object" && !!val && "absoluteBoundingBox" in val && _typeof(val.absoluteBoundingBox) === "object" && !!val.absoluteBoundingBox && "x" in val.absoluteBoundingBox && "y" in val.absoluteBoundingBox && "width" in val.absoluteBoundingBox && "height" in val.absoluteBoundingBox;
}

/**
 * Checks if:
 * 1. A node is a child to an auto layout frame
 * 2. The child adheres to the auto layout rules—i.e. it's not absolutely positioned
 *
 * @param node - The node to check.
 * @param parent - The parent node.
 * @returns True if the node is a child of an auto layout frame, false otherwise.
 */
function isInAutoLayoutFlow(node, parent) {
  var _parent$layoutMode;
  var autoLayoutModes = ["HORIZONTAL", "VERTICAL"];
  return isFrame(parent) && autoLayoutModes.includes((_parent$layoutMode = parent.layoutMode) !== null && _parent$layoutMode !== void 0 ? _parent$layoutMode : "NONE") && isLayout(node) && node.layoutPositioning !== "ABSOLUTE";
}
function isStrokeWeights(val) {
  return _typeof(val) === "object" && val !== null && "top" in val && "right" in val && "bottom" in val && "left" in val;
}
function isRectangle(key, obj) {
  var recordObj = obj;
  var val = recordObj[key];
  return _typeof(obj) === "object" && !!obj && key in recordObj && _typeof(val) === "object" && val !== null && "x" in val && "y" in val && "width" in val && "height" in val;
}
function isRectangleCornerRadii(val) {
  return Array.isArray(val) && val.length === 4 && val.every(function (v) {
    return typeof v === "number";
  });
}
function isCSSColorValue(val) {
  return typeof val === "string" && (val.startsWith("#") || val.startsWith("rgba"));
}