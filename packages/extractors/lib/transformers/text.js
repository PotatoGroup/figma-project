"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractNodeText = extractNodeText;
exports.extractTextStyle = extractTextStyle;
exports.hasTextStyle = hasTextStyle;
exports.isTextNode = isTextNode;
var _identity = require("../utils/identity.js");
var _remeda = require("remeda");
function isTextNode(n) {
  return n.type === "TEXT";
}
function hasTextStyle(n) {
  return (0, _identity.hasValue)("style", n) && Object.keys(n.style).length > 0;
}

// Keep other simple properties directly
function extractNodeText(n) {
  if ((0, _identity.hasValue)("characters", n, _remeda.isTruthy)) {
    return n.characters;
  }
}
function extractTextStyle(n) {
  if (hasTextStyle(n)) {
    var style = n.style;
    var textStyle = {
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontSize: style.fontSize,
      lineHeight: "lineHeightPx" in style && style.lineHeightPx && style.fontSize ? "".concat(style.lineHeightPx / style.fontSize, "em") : undefined,
      letterSpacing: style.letterSpacing && style.letterSpacing !== 0 && style.fontSize ? "".concat(style.letterSpacing / style.fontSize * 100, "%") : undefined,
      textCase: style.textCase,
      textAlignHorizontal: style.textAlignHorizontal,
      textAlignVertical: style.textAlignVertical
    };
    return textStyle;
  }
}