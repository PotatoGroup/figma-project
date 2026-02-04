import { hasValue } from "../utils/identity.js";
import { isTruthy } from "remeda";
export function isTextNode(n) {
  return n.type === "TEXT";
}
export function hasTextStyle(n) {
  return hasValue("style", n) && Object.keys(n.style).length > 0;
}

// Keep other simple properties directly
export function extractNodeText(n) {
  if (hasValue("characters", n, isTruthy)) {
    return n.characters;
  }
}
export function extractTextStyle(n) {
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