"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simplifyComponentSets = simplifyComponentSets;
exports.simplifyComponents = simplifyComponents;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * Remove unnecessary component properties and convert to simplified format.
 */
function simplifyComponents(aggregatedComponents) {
  return Object.fromEntries(Object.entries(aggregatedComponents).map(function (_ref) {
    var _comp$componentSetId;
    var _ref2 = _slicedToArray(_ref, 2),
      id = _ref2[0],
      comp = _ref2[1];
    return [id, {
      id: id,
      key: comp.key,
      name: comp.name,
      componentSetId: (_comp$componentSetId = comp.componentSetId) !== null && _comp$componentSetId !== void 0 ? _comp$componentSetId : ""
    }];
  }));
}

/**
 * Remove unnecessary component set properties and convert to simplified format.
 */
function simplifyComponentSets(aggregatedComponentSets) {
  return Object.fromEntries(Object.entries(aggregatedComponentSets).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      id = _ref4[0],
      set = _ref4[1];
    return [id, {
      id: id,
      key: set.key,
      name: set.name,
      description: set.description
    }];
  }));
}