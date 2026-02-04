function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import fs from "fs";
import sharp from "sharp";
/**
 * Apply crop transform to an image based on Figma's transformation matrix
 * @param imagePath - Path to the original image file
 * @param cropTransform - Figma transform matrix [[scaleX, skewX, translateX], [skewY, scaleY, translateY]]
 * @returns Promise<string> - Path to the cropped image
 */
export function applyCropTransform(_x, _x2) {
  return _applyCropTransform.apply(this, arguments);
}

/**
 * Get image dimensions from a file
 * @param imagePath - Path to the image file
 * @returns Promise<{width: number, height: number}>
 */
function _applyCropTransform() {
  _applyCropTransform = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(imagePath, cropTransform) {
    var _yield$import, Logger, _cropTransform$0$, _cropTransform$, _cropTransform$0$2, _cropTransform$2, _cropTransform$0$3, _cropTransform$3, _cropTransform$1$, _cropTransform$4, _cropTransform$1$2, _cropTransform$5, _cropTransform$1$3, _cropTransform$6, scaleX, skewX, translateX, skewY, scaleY, translateY, image, metadata, width, height, cropLeft, cropTop, cropWidth, cropHeight, tempPath;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return import("./logger.js");
        case 2:
          _yield$import = _context.sent;
          Logger = _yield$import.Logger;
          _context.prev = 4;
          // Extract transform values
          scaleX = (_cropTransform$0$ = (_cropTransform$ = cropTransform[0]) === null || _cropTransform$ === void 0 ? void 0 : _cropTransform$[0]) !== null && _cropTransform$0$ !== void 0 ? _cropTransform$0$ : 1;
          skewX = (_cropTransform$0$2 = (_cropTransform$2 = cropTransform[0]) === null || _cropTransform$2 === void 0 ? void 0 : _cropTransform$2[1]) !== null && _cropTransform$0$2 !== void 0 ? _cropTransform$0$2 : 0;
          translateX = (_cropTransform$0$3 = (_cropTransform$3 = cropTransform[0]) === null || _cropTransform$3 === void 0 ? void 0 : _cropTransform$3[2]) !== null && _cropTransform$0$3 !== void 0 ? _cropTransform$0$3 : 0;
          skewY = (_cropTransform$1$ = (_cropTransform$4 = cropTransform[1]) === null || _cropTransform$4 === void 0 ? void 0 : _cropTransform$4[0]) !== null && _cropTransform$1$ !== void 0 ? _cropTransform$1$ : 0;
          scaleY = (_cropTransform$1$2 = (_cropTransform$5 = cropTransform[1]) === null || _cropTransform$5 === void 0 ? void 0 : _cropTransform$5[1]) !== null && _cropTransform$1$2 !== void 0 ? _cropTransform$1$2 : 1;
          translateY = (_cropTransform$1$3 = (_cropTransform$6 = cropTransform[1]) === null || _cropTransform$6 === void 0 ? void 0 : _cropTransform$6[2]) !== null && _cropTransform$1$3 !== void 0 ? _cropTransform$1$3 : 0; // Load the image and get metadata
          image = sharp(imagePath);
          _context.next = 14;
          return image.metadata();
        case 14:
          metadata = _context.sent;
          if (!(!metadata.width || !metadata.height)) {
            _context.next = 17;
            break;
          }
          throw new Error("Could not get image dimensions for ".concat(imagePath));
        case 17:
          width = metadata.width, height = metadata.height; // Calculate crop region based on transform matrix
          // Figma's transform matrix represents how the image is positioned within its container
          // We need to extract the visible portion based on the scaling and translation
          // The transform matrix defines the visible area as:
          // - scaleX/scaleY: how much of the original image is visible (0-1)
          // - translateX/translateY: offset of the visible area (0-1, relative to image size)
          cropLeft = Math.max(0, Math.round(translateX * width));
          cropTop = Math.max(0, Math.round(translateY * height));
          cropWidth = Math.min(width - cropLeft, Math.round(scaleX * width));
          cropHeight = Math.min(height - cropTop, Math.round(scaleY * height)); // Validate crop dimensions
          if (!(cropWidth <= 0 || cropHeight <= 0)) {
            _context.next = 25;
            break;
          }
          Logger.log("Invalid crop dimensions for ".concat(imagePath, ", using original image"));
          return _context.abrupt("return", imagePath);
        case 25:
          // Overwrite the original file with the cropped version
          tempPath = imagePath + ".tmp"; // Apply crop transformation to temporary file first
          _context.next = 28;
          return image.extract({
            left: cropLeft,
            top: cropTop,
            width: cropWidth,
            height: cropHeight
          }).toFile(tempPath);
        case 28:
          // Replace original file with cropped version
          fs.renameSync(tempPath, imagePath);
          Logger.log("Cropped image saved (overwritten): ".concat(imagePath));
          Logger.log("Crop region: ".concat(cropLeft, ", ").concat(cropTop, ", ").concat(cropWidth, "x").concat(cropHeight, " from ").concat(width, "x").concat(height));
          return _context.abrupt("return", imagePath);
        case 34:
          _context.prev = 34;
          _context.t0 = _context["catch"](4);
          Logger.error("Error cropping image ".concat(imagePath, ":"), _context.t0);
          // Return original path if cropping fails
          return _context.abrupt("return", imagePath);
        case 38:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 34]]);
  }));
  return _applyCropTransform.apply(this, arguments);
}
export function getImageDimensions(_x3) {
  return _getImageDimensions.apply(this, arguments);
}
function _getImageDimensions() {
  _getImageDimensions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(imagePath) {
    var _yield$import2, Logger, metadata;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return import("./logger.js");
        case 2:
          _yield$import2 = _context2.sent;
          Logger = _yield$import2.Logger;
          _context2.prev = 4;
          _context2.next = 7;
          return sharp(imagePath).metadata();
        case 7:
          metadata = _context2.sent;
          if (!(!metadata.width || !metadata.height)) {
            _context2.next = 10;
            break;
          }
          throw new Error("Could not get image dimensions for ".concat(imagePath));
        case 10:
          return _context2.abrupt("return", {
            width: metadata.width,
            height: metadata.height
          });
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](4);
          Logger.error("Error getting image dimensions for ".concat(imagePath, ":"), _context2.t0);
          // Return default dimensions if reading fails
          return _context2.abrupt("return", {
            width: 1000,
            height: 1000
          });
        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[4, 13]]);
  }));
  return _getImageDimensions.apply(this, arguments);
}
/**
 * Enhanced image download with post-processing
 * @param fileName - The filename to save as
 * @param localPath - The local path to save to
 * @param imageUrl - Image URL
 * @param needsCropping - Whether to apply crop transform
 * @param cropTransform - Transform matrix for cropping
 * @param requiresImageDimensions - Whether to generate dimension metadata
 * @returns Promise<ImageProcessingResult> - Detailed processing information
 */
export function downloadAndProcessImage(_x4, _x5, _x6) {
  return _downloadAndProcessImage.apply(this, arguments);
}

/**
 * Create CSS custom properties for image dimensions
 * @param imagePath - Path to the image file
 * @returns Promise<string> - CSS custom properties
 */
function _downloadAndProcessImage() {
  _downloadAndProcessImage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(fileName, localPath, imageUrl) {
    var needsCropping,
      cropTransform,
      requiresImageDimensions,
      _yield$import3,
      Logger,
      processingLog,
      _yield$import4,
      downloadFigmaImage,
      originalPath,
      originalDimensions,
      finalPath,
      wasCropped,
      cropRegion,
      _cropTransform$0$4,
      _cropTransform$7,
      _cropTransform$1$4,
      _cropTransform$8,
      _cropTransform$0$5,
      _cropTransform$9,
      _cropTransform$1$5,
      _cropTransform$10,
      scaleX,
      scaleY,
      translateX,
      translateY,
      cropLeft,
      cropTop,
      cropWidth,
      cropHeight,
      finalDimensions,
      cssVariables,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          needsCropping = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : false;
          cropTransform = _args3.length > 4 ? _args3[4] : undefined;
          requiresImageDimensions = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : false;
          _context3.next = 5;
          return import("./logger.js");
        case 5:
          _yield$import3 = _context3.sent;
          Logger = _yield$import3.Logger;
          processingLog = []; // First download the original image
          _context3.next = 10;
          return import("./common.js");
        case 10:
          _yield$import4 = _context3.sent;
          downloadFigmaImage = _yield$import4.downloadFigmaImage;
          _context3.next = 14;
          return downloadFigmaImage(fileName, localPath, imageUrl);
        case 14:
          originalPath = _context3.sent;
          Logger.log("Downloaded original image: ".concat(originalPath));

          // Get original dimensions before any processing
          _context3.next = 18;
          return getImageDimensions(originalPath);
        case 18:
          originalDimensions = _context3.sent;
          Logger.log("Original dimensions: ".concat(originalDimensions.width, "x").concat(originalDimensions.height));
          finalPath = originalPath;
          wasCropped = false;
          if (!(needsCropping && cropTransform)) {
            _context3.next = 42;
            break;
          }
          Logger.log("Applying crop transform...");

          // Extract crop region info before applying transform
          scaleX = (_cropTransform$0$4 = (_cropTransform$7 = cropTransform[0]) === null || _cropTransform$7 === void 0 ? void 0 : _cropTransform$7[0]) !== null && _cropTransform$0$4 !== void 0 ? _cropTransform$0$4 : 1;
          scaleY = (_cropTransform$1$4 = (_cropTransform$8 = cropTransform[1]) === null || _cropTransform$8 === void 0 ? void 0 : _cropTransform$8[1]) !== null && _cropTransform$1$4 !== void 0 ? _cropTransform$1$4 : 1;
          translateX = (_cropTransform$0$5 = (_cropTransform$9 = cropTransform[0]) === null || _cropTransform$9 === void 0 ? void 0 : _cropTransform$9[2]) !== null && _cropTransform$0$5 !== void 0 ? _cropTransform$0$5 : 0;
          translateY = (_cropTransform$1$5 = (_cropTransform$10 = cropTransform[1]) === null || _cropTransform$10 === void 0 ? void 0 : _cropTransform$10[2]) !== null && _cropTransform$1$5 !== void 0 ? _cropTransform$1$5 : 0;
          cropLeft = Math.max(0, Math.round(translateX * originalDimensions.width));
          cropTop = Math.max(0, Math.round(translateY * originalDimensions.height));
          cropWidth = Math.min(originalDimensions.width - cropLeft, Math.round(scaleX * originalDimensions.width));
          cropHeight = Math.min(originalDimensions.height - cropTop, Math.round(scaleY * originalDimensions.height));
          if (!(cropWidth > 0 && cropHeight > 0)) {
            _context3.next = 41;
            break;
          }
          cropRegion = {
            left: cropLeft,
            top: cropTop,
            width: cropWidth,
            height: cropHeight
          };
          _context3.next = 36;
          return applyCropTransform(originalPath, cropTransform);
        case 36:
          finalPath = _context3.sent;
          wasCropped = true;
          Logger.log("Cropped to region: ".concat(cropLeft, ", ").concat(cropTop, ", ").concat(cropWidth, "x").concat(cropHeight));
          _context3.next = 42;
          break;
        case 41:
          Logger.log("Invalid crop dimensions, keeping original image");
        case 42:
          _context3.next = 44;
          return getImageDimensions(finalPath);
        case 44:
          finalDimensions = _context3.sent;
          Logger.log("Final dimensions: ".concat(finalDimensions.width, "x").concat(finalDimensions.height));

          // Generate CSS variables if required (for TILE mode)

          if (requiresImageDimensions) {
            cssVariables = generateImageCSSVariables(finalDimensions);
          }
          return _context3.abrupt("return", {
            filePath: finalPath,
            originalDimensions: originalDimensions,
            finalDimensions: finalDimensions,
            wasCropped: wasCropped,
            cropRegion: cropRegion,
            cssVariables: cssVariables,
            processingLog: processingLog
          });
        case 48:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _downloadAndProcessImage.apply(this, arguments);
}
export function generateImageCSSVariables(_ref) {
  var width = _ref.width,
    height = _ref.height;
  return "--original-width: ".concat(width, "px; --original-height: ").concat(height, "px;");
}