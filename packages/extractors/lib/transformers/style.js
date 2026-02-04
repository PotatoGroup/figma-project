"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSimplifiedStrokes = buildSimplifiedStrokes;
exports.convertColor = convertColor;
exports.formatRGBAColor = formatRGBAColor;
exports.hexToRgba = hexToRgba;
exports.parsePaint = parsePaint;
var _common = require("../utils/common.js");
var _identity = require("../utils/identity.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Simplified image fill with CSS properties and processing metadata
 *
 * This type represents an image fill that can be used as either:
 * - background-image (when parent node has children)
 * - <img> tag (when parent node has no children)
 *
 * The CSS properties are mutually exclusive based on usage context.
 */

/**
 * Translate Figma scale modes to CSS properties based on usage context
 *
 * @param scaleMode - The Figma scale mode (FILL, FIT, TILE, STRETCH)
 * @param isBackground - Whether this image will be used as background-image (true) or <img> tag (false)
 * @param scalingFactor - For TILE mode, the scaling factor relative to original image size
 * @returns Object containing CSS properties and processing metadata
 */
function translateScaleMode(scaleMode, hasChildren, scalingFactor) {
  var isBackground = hasChildren;
  switch (scaleMode) {
    case "FILL":
      // Image covers entire container, may be cropped
      return {
        css: isBackground ? {
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          isBackground: true
        } : {
          objectFit: "cover",
          isBackground: false
        },
        processing: {
          needsCropping: false,
          requiresImageDimensions: false
        }
      };
    case "FIT":
      // Image fits entirely within container, may have empty space
      return {
        css: isBackground ? {
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          isBackground: true
        } : {
          objectFit: "contain",
          isBackground: false
        },
        processing: {
          needsCropping: false,
          requiresImageDimensions: false
        }
      };
    case "TILE":
      // Image repeats to fill container at specified scale
      // Always treat as background image (can't tile an <img> tag)
      return {
        css: {
          backgroundRepeat: "repeat",
          backgroundSize: scalingFactor ? "calc(var(--original-width) * ".concat(scalingFactor, ") calc(var(--original-height) * ").concat(scalingFactor, ")") : "auto",
          isBackground: true
        },
        processing: {
          needsCropping: false,
          requiresImageDimensions: true
        }
      };
    case "STRETCH":
      // Figma calls crop "STRETCH" in its API.
      return {
        css: isBackground ? {
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          isBackground: true
        } : {
          objectFit: "fill",
          isBackground: false
        },
        processing: {
          needsCropping: false,
          requiresImageDimensions: false
        }
      };
    default:
      return {
        css: {},
        processing: {
          needsCropping: false,
          requiresImageDimensions: false
        }
      };
  }
}

/**
 * Generate a short hash from a transform matrix to create unique filenames
 * @param transform - The transform matrix to hash
 * @returns Short hash string for filename suffix
 */
function generateTransformHash(transform) {
  var values = transform.flat();
  var hash = values.reduce(function (acc, val) {
    // Simple hash function - convert to string and create checksum
    var str = val.toString();
    for (var i = 0; i < str.length; i++) {
      acc = (acc << 5) - acc + str.charCodeAt(i) & 0xffffffff;
    }
    return acc;
  }, 0);

  // Convert to positive hex string, take first 6 chars
  return Math.abs(hash).toString(16).substring(0, 6);
}

/**
 * Handle imageTransform for post-processing (not CSS translation)
 *
 * When Figma includes an imageTransform matrix, it means the image is cropped/transformed.
 * This function converts the transform into processing instructions for Sharp.
 *
 * @param imageTransform - Figma's 2x3 transform matrix [[scaleX, skewX, translateX], [skewY, scaleY, translateY]]
 * @returns Processing metadata for image cropping
 */
function handleImageTransform(imageTransform) {
  var transformHash = generateTransformHash(imageTransform);
  return {
    needsCropping: true,
    requiresImageDimensions: false,
    cropTransform: imageTransform,
    filenameSuffix: "".concat(transformHash)
  };
}

/**
 * Build simplified stroke information from a Figma node
 *
 * @param n - The Figma node to extract stroke information from
 * @param hasChildren - Whether the node has children (affects paint processing)
 * @returns Simplified stroke object with colors and properties
 */
function buildSimplifiedStrokes(n) {
  var hasChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var strokes = {
    colors: []
  };
  if ((0, _identity.hasValue)("strokes", n) && Array.isArray(n.strokes) && n.strokes.length) {
    strokes.colors = n.strokes.filter(_common.isVisible).map(function (stroke) {
      return parsePaint(stroke, hasChildren);
    });
  }
  if ((0, _identity.hasValue)("strokeWeight", n) && typeof n.strokeWeight === "number" && n.strokeWeight > 0) {
    strokes.strokeWeight = "".concat(n.strokeWeight, "px");
  }
  if ((0, _identity.hasValue)("strokeDashes", n) && Array.isArray(n.strokeDashes) && n.strokeDashes.length) {
    strokes.strokeDashes = n.strokeDashes;
  }
  if ((0, _identity.hasValue)("individualStrokeWeights", n, _identity.isStrokeWeights)) {
    strokes.strokeWeight = (0, _common.generateCSSShorthand)(n.individualStrokeWeights);
  }
  return strokes;
}

/**
 * Convert a Figma paint (solid, image, gradient) to a SimplifiedFill
 * @param raw - The Figma paint to convert
 * @param hasChildren - Whether the node has children (determines CSS properties)
 * @returns The converted SimplifiedFill
 */
function parsePaint(raw) {
  var hasChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (raw.type === "IMAGE") {
    var baseImageFill = {
      type: "IMAGE",
      imageRef: raw.imageRef,
      scaleMode: raw.scaleMode,
      scalingFactor: raw.scalingFactor
    };

    // Get CSS properties and processing metadata from scale mode
    // TILE mode always needs to be treated as background image (can't tile an <img> tag)
    var isBackground = hasChildren || baseImageFill.scaleMode === "TILE";
    var _translateScaleMode = translateScaleMode(baseImageFill.scaleMode, isBackground, raw.scalingFactor),
      css = _translateScaleMode.css,
      processing = _translateScaleMode.processing;

    // Combine scale mode processing with transform processing if needed
    // Transform processing (cropping) takes precedence over scale mode processing
    var finalProcessing = processing;
    if (raw.imageTransform) {
      var transformProcessing = handleImageTransform(raw.imageTransform);
      finalProcessing = _objectSpread(_objectSpread(_objectSpread({}, processing), transformProcessing), {}, {
        // Keep requiresImageDimensions from scale mode (needed for TILE)
        requiresImageDimensions: processing.requiresImageDimensions || transformProcessing.requiresImageDimensions
      });
    }
    return _objectSpread(_objectSpread(_objectSpread({}, baseImageFill), css), {}, {
      imageDownloadArguments: finalProcessing
    });
  } else if (raw.type === "SOLID") {
    // treat as SOLID
    var _convertColor = convertColor(raw.color, raw.opacity),
      hex = _convertColor.hex,
      opacity = _convertColor.opacity;
    if (opacity === 1) {
      return hex;
    } else {
      return formatRGBAColor(raw.color, opacity);
    }
  } else if (raw.type === "PATTERN") {
    return parsePatternPaint(raw);
  } else if (["GRADIENT_LINEAR", "GRADIENT_RADIAL", "GRADIENT_ANGULAR", "GRADIENT_DIAMOND"].includes(raw.type)) {
    return {
      type: raw.type,
      gradient: convertGradientToCss(raw)
    };
  } else {
    throw new Error("Unknown paint type: ".concat(raw.type));
  }
}

/**
 * Convert a Figma PatternPaint to a CSS-like pattern fill.
 *
 * Ignores `tileType` and `spacing` from the Figma API currently as there's
 * no great way to translate them to CSS.
 *
 * @param raw - The Figma PatternPaint to convert
 * @returns The converted pattern SimplifiedFill
 */
function parsePatternPaint(raw) {
  /**
   * The only CSS-like repeat value supported by Figma is repeat.
   *
   * They also have hexagonal horizontal and vertical repeats, but
   * those aren't easy to pull off in CSS, so we just use repeat.
   */
  var backgroundRepeat = "repeat";
  var horizontal = "left";
  switch (raw.horizontalAlignment) {
    case "START":
      horizontal = "left";
      break;
    case "CENTER":
      horizontal = "center";
      break;
    case "END":
      horizontal = "right";
      break;
  }
  var vertical = "top";
  switch (raw.verticalAlignment) {
    case "START":
      vertical = "top";
      break;
    case "CENTER":
      vertical = "center";
      break;
    case "END":
      vertical = "bottom";
      break;
  }
  return {
    type: raw.type,
    patternSource: {
      type: "IMAGE-PNG",
      nodeId: raw.sourceNodeId
    },
    backgroundRepeat: backgroundRepeat,
    backgroundSize: "".concat(Math.round(raw.scalingFactor * 100), "%"),
    backgroundPosition: "".concat(horizontal, " ").concat(vertical)
  };
}

/**
 * Convert hex color value and opacity to rgba format
 * @param hex - Hexadecimal color value (e.g., "#FF0000" or "#F00")
 * @param opacity - Opacity value (0-1)
 * @returns Color string in rgba format
 */
function hexToRgba(hex) {
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  // Remove possible # prefix
  hex = hex.replace("#", "");

  // Handle shorthand hex values (e.g., #FFF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert hex to RGB values
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // Ensure opacity is in the 0-1 range
  var validOpacity = Math.min(Math.max(opacity, 0), 1);
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(validOpacity, ")");
}

/**
 * Convert color from RGBA to { hex, opacity }
 *
 * @param color - The color to convert, including alpha channel
 * @param opacity - The opacity of the color, if not included in alpha channel
 * @returns The converted color
 **/
function convertColor(color) {
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var r = Math.round(color.r * 255);
  var g = Math.round(color.g * 255);
  var b = Math.round(color.b * 255);

  // Alpha channel defaults to 1. If opacity and alpha are both and < 1, their effects are multiplicative
  var a = Math.round(opacity * color.a * 100) / 100;
  var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  return {
    hex: hex,
    opacity: a
  };
}

/**
 * Convert color from Figma RGBA to rgba(#, #, #, #) CSS format
 *
 * @param color - The color to convert, including alpha channel
 * @param opacity - The opacity of the color, if not included in alpha channel
 * @returns The converted color
 **/
function formatRGBAColor(color) {
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var r = Math.round(color.r * 255);
  var g = Math.round(color.g * 255);
  var b = Math.round(color.b * 255);
  // Alpha channel defaults to 1. If opacity and alpha are both and < 1, their effects are multiplicative
  var a = Math.round(opacity * color.a * 100) / 100;
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
}

/**
 * Map gradient stops from Figma's handle-based coordinate system to CSS percentages
 */
function mapGradientStops(gradient) {
  var elementBounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    width: 1,
    height: 1
  };
  var handles = gradient.gradientHandlePositions;
  if (!handles || handles.length < 2) {
    var stops = gradient.gradientStops.map(function (_ref) {
      var position = _ref.position,
        color = _ref.color;
      var cssColor = formatRGBAColor(color, 1);
      return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
    }).join(", ");
    return {
      stops: stops,
      cssGeometry: "0deg"
    };
  }
  var _handles = _slicedToArray(handles, 3),
    handle1 = _handles[0],
    handle2 = _handles[1],
    handle3 = _handles[2];
  switch (gradient.type) {
    case "GRADIENT_LINEAR":
      {
        return mapLinearGradient(gradient.gradientStops, handle1, handle2, elementBounds);
      }
    case "GRADIENT_RADIAL":
      {
        return mapRadialGradient(gradient.gradientStops, handle1, handle2, handle3, elementBounds);
      }
    case "GRADIENT_ANGULAR":
      {
        return mapAngularGradient(gradient.gradientStops, handle1, handle2, handle3, elementBounds);
      }
    case "GRADIENT_DIAMOND":
      {
        return mapDiamondGradient(gradient.gradientStops, handle1, handle2, handle3, elementBounds);
      }
    default:
      {
        var _stops = gradient.gradientStops.map(function (_ref2) {
          var position = _ref2.position,
            color = _ref2.color;
          var cssColor = formatRGBAColor(color, 1);
          return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
        }).join(", ");
        return {
          stops: _stops,
          cssGeometry: "0deg"
        };
      }
  }
}

/**
 * Map linear gradient from Figma handles to CSS
 */
function mapLinearGradient(gradientStops, start, end, elementBounds) {
  // Calculate the gradient line in element space
  var dx = end.x - start.x;
  var dy = end.y - start.y;
  var gradientLength = Math.sqrt(dx * dx + dy * dy);

  // Handle degenerate case
  if (gradientLength === 0) {
    var stops = gradientStops.map(function (_ref3) {
      var position = _ref3.position,
        color = _ref3.color;
      var cssColor = formatRGBAColor(color, 1);
      return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
    }).join(", ");
    return {
      stops: stops,
      cssGeometry: "0deg"
    };
  }

  // Calculate angle for CSS
  var angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

  // Find where the extended gradient line intersects the element boundaries
  var extendedIntersections = findExtendedLineIntersections(start, end);
  if (extendedIntersections.length >= 2) {
    // The gradient line extended to fill the element
    var fullLineStart = Math.min(extendedIntersections[0], extendedIntersections[1]);
    var fullLineEnd = Math.max(extendedIntersections[0], extendedIntersections[1]);
    var fullLineLength = fullLineEnd - fullLineStart;

    // Map gradient stops from the Figma line segment to the full CSS line
    var _mappedStops = gradientStops.map(function (_ref4) {
      var position = _ref4.position,
        color = _ref4.color;
      var cssColor = formatRGBAColor(color, 1);

      // Position along the Figma gradient line (0 = start handle, 1 = end handle)
      var figmaLinePosition = position;

      // The Figma line spans from t=0 to t=1
      // The full extended line spans from fullLineStart to fullLineEnd
      // Map the figma position to the extended line
      var tOnExtendedLine = figmaLinePosition * (1 - 0) + 0; // This is just figmaLinePosition
      var extendedPosition = (tOnExtendedLine - fullLineStart) / (fullLineEnd - fullLineStart);
      var clampedPosition = Math.max(0, Math.min(1, extendedPosition));
      return "".concat(cssColor, " ").concat(Math.round(clampedPosition * 100), "%");
    });
    return {
      stops: _mappedStops.join(", "),
      cssGeometry: "".concat(Math.round(angle), "deg")
    };
  }

  // Fallback to simple gradient if intersection calculation fails
  var mappedStops = gradientStops.map(function (_ref5) {
    var position = _ref5.position,
      color = _ref5.color;
    var cssColor = formatRGBAColor(color, 1);
    return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
  });
  return {
    stops: mappedStops.join(", "),
    cssGeometry: "".concat(Math.round(angle), "deg")
  };
}

/**
 * Find where the extended gradient line intersects with the element boundaries
 */
function findExtendedLineIntersections(start, end) {
  var dx = end.x - start.x;
  var dy = end.y - start.y;

  // Handle degenerate case
  if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) {
    return [];
  }
  var intersections = [];

  // Check intersection with each edge of the unit square [0,1] x [0,1]
  // Top edge (y = 0)
  if (Math.abs(dy) > 1e-10) {
    var t = -start.y / dy;
    var x = start.x + t * dx;
    if (x >= 0 && x <= 1) {
      intersections.push(t);
    }
  }

  // Bottom edge (y = 1)
  if (Math.abs(dy) > 1e-10) {
    var _t = (1 - start.y) / dy;
    var _x = start.x + _t * dx;
    if (_x >= 0 && _x <= 1) {
      intersections.push(_t);
    }
  }

  // Left edge (x = 0)
  if (Math.abs(dx) > 1e-10) {
    var _t2 = -start.x / dx;
    var y = start.y + _t2 * dy;
    if (y >= 0 && y <= 1) {
      intersections.push(_t2);
    }
  }

  // Right edge (x = 1)
  if (Math.abs(dx) > 1e-10) {
    var _t3 = (1 - start.x) / dx;
    var _y = start.y + _t3 * dy;
    if (_y >= 0 && _y <= 1) {
      intersections.push(_t3);
    }
  }

  // Remove duplicates and sort
  var uniqueIntersections = _toConsumableArray(new Set(intersections.map(function (t) {
    return Math.round(t * 1000000) / 1000000;
  })));
  return uniqueIntersections.sort(function (a, b) {
    return a - b;
  });
}

/**
 * Find where a line intersects with the unit square (0,0) to (1,1)
 */
function findLineIntersections(start, end) {
  var dx = end.x - start.x;
  var dy = end.y - start.y;
  var intersections = [];

  // Check intersection with each edge of the unit square
  var edges = [{
    x: 0,
    y: 0,
    dx: 1,
    dy: 0
  },
  // top edge
  {
    x: 1,
    y: 0,
    dx: 0,
    dy: 1
  },
  // right edge
  {
    x: 1,
    y: 1,
    dx: -1,
    dy: 0
  },
  // bottom edge
  {
    x: 0,
    y: 1,
    dx: 0,
    dy: -1
  } // left edge
  ];
  for (var _i = 0, _edges = edges; _i < _edges.length; _i++) {
    var edge = _edges[_i];
    var t = lineIntersection(start, {
      x: dx,
      y: dy
    }, edge, {
      x: edge.dx,
      y: edge.dy
    });
    if (t !== null && t >= 0 && t <= 1) {
      intersections.push(t);
    }
  }
  return intersections.sort(function (a, b) {
    return a - b;
  });
}

/**
 * Calculate line intersection parameter
 */
function lineIntersection(p1, d1, p2, d2) {
  var denominator = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(denominator) < 1e-10) return null; // Lines are parallel

  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var t = (dx * d2.y - dy * d2.x) / denominator;
  return t;
}

/**
 * Map radial gradient from Figma handles to CSS
 */
function mapRadialGradient(gradientStops, center, edge, widthHandle, elementBounds) {
  var centerX = Math.round(center.x * 100);
  var centerY = Math.round(center.y * 100);
  var stops = gradientStops.map(function (_ref6) {
    var position = _ref6.position,
      color = _ref6.color;
    var cssColor = formatRGBAColor(color, 1);
    return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
  }).join(", ");
  return {
    stops: stops,
    cssGeometry: "circle at ".concat(centerX, "% ").concat(centerY, "%")
  };
}

/**
 * Map angular gradient from Figma handles to CSS
 */
function mapAngularGradient(gradientStops, center, angleHandle, widthHandle, elementBounds) {
  var centerX = Math.round(center.x * 100);
  var centerY = Math.round(center.y * 100);
  var angle = Math.atan2(angleHandle.y - center.y, angleHandle.x - center.x) * (180 / Math.PI) + 90;
  var stops = gradientStops.map(function (_ref7) {
    var position = _ref7.position,
      color = _ref7.color;
    var cssColor = formatRGBAColor(color, 1);
    return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
  }).join(", ");
  return {
    stops: stops,
    cssGeometry: "from ".concat(Math.round(angle), "deg at ").concat(centerX, "% ").concat(centerY, "%")
  };
}

/**
 * Map diamond gradient from Figma handles to CSS (approximate with ellipse)
 */
function mapDiamondGradient(gradientStops, center, edge, widthHandle, elementBounds) {
  var centerX = Math.round(center.x * 100);
  var centerY = Math.round(center.y * 100);
  var stops = gradientStops.map(function (_ref8) {
    var position = _ref8.position,
      color = _ref8.color;
    var cssColor = formatRGBAColor(color, 1);
    return "".concat(cssColor, " ").concat(Math.round(position * 100), "%");
  }).join(", ");
  return {
    stops: stops,
    cssGeometry: "ellipse at ".concat(centerX, "% ").concat(centerY, "%")
  };
}

/**
 * Convert a Figma gradient to CSS gradient syntax
 */
function convertGradientToCss(gradient) {
  // Sort stops by position to ensure proper order
  var sortedGradient = _objectSpread(_objectSpread({}, gradient), {}, {
    gradientStops: _toConsumableArray(gradient.gradientStops).sort(function (a, b) {
      return a.position - b.position;
    })
  });

  // Map gradient stops using handle-based geometry
  var _mapGradientStops = mapGradientStops(sortedGradient),
    stops = _mapGradientStops.stops,
    cssGeometry = _mapGradientStops.cssGeometry;
  switch (gradient.type) {
    case "GRADIENT_LINEAR":
      {
        return "linear-gradient(".concat(cssGeometry, ", ").concat(stops, ")");
      }
    case "GRADIENT_RADIAL":
      {
        return "radial-gradient(".concat(cssGeometry, ", ").concat(stops, ")");
      }
    case "GRADIENT_ANGULAR":
      {
        return "conic-gradient(".concat(cssGeometry, ", ").concat(stops, ")");
      }
    case "GRADIENT_DIAMOND":
      {
        return "radial-gradient(".concat(cssGeometry, ", ").concat(stops, ")");
      }
    default:
      return "linear-gradient(0deg, ".concat(stops, ")");
  }
}