"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  extractFromDesign: true,
  simplifyRawFigmaObject: true,
  layoutExtractor: true,
  textExtractor: true,
  visualsExtractor: true,
  componentExtractor: true,
  allExtractors: true,
  layoutAndText: true,
  contentOnly: true,
  visualsOnly: true,
  layoutOnly: true
};
Object.defineProperty(exports, "allExtractors", {
  enumerable: true,
  get: function get() {
    return _builtIn.allExtractors;
  }
});
Object.defineProperty(exports, "componentExtractor", {
  enumerable: true,
  get: function get() {
    return _builtIn.componentExtractor;
  }
});
Object.defineProperty(exports, "contentOnly", {
  enumerable: true,
  get: function get() {
    return _builtIn.contentOnly;
  }
});
Object.defineProperty(exports, "extractFromDesign", {
  enumerable: true,
  get: function get() {
    return _nodeWalker.extractFromDesign;
  }
});
Object.defineProperty(exports, "layoutAndText", {
  enumerable: true,
  get: function get() {
    return _builtIn.layoutAndText;
  }
});
Object.defineProperty(exports, "layoutExtractor", {
  enumerable: true,
  get: function get() {
    return _builtIn.layoutExtractor;
  }
});
Object.defineProperty(exports, "layoutOnly", {
  enumerable: true,
  get: function get() {
    return _builtIn.layoutOnly;
  }
});
Object.defineProperty(exports, "simplifyRawFigmaObject", {
  enumerable: true,
  get: function get() {
    return _designExtractor.simplifyRawFigmaObject;
  }
});
Object.defineProperty(exports, "textExtractor", {
  enumerable: true,
  get: function get() {
    return _builtIn.textExtractor;
  }
});
Object.defineProperty(exports, "visualsExtractor", {
  enumerable: true,
  get: function get() {
    return _builtIn.visualsExtractor;
  }
});
Object.defineProperty(exports, "visualsOnly", {
  enumerable: true,
  get: function get() {
    return _builtIn.visualsOnly;
  }
});
var _nodeWalker = require("./node-walker.js");
var _designExtractor = require("./design-extractor.js");
var _builtIn = require("./built-in.js");
var _imageProcessing = require("./utils/image-processing.js");
Object.keys(_imageProcessing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _imageProcessing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _imageProcessing[key];
    }
  });
});