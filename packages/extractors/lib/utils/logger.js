"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;
exports.writeLogs = writeLogs;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var Logger = exports.Logger = {
  isHTTP: false,
  log: function log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (Logger.isHTTP) {
      var _console;
      (_console = console).log.apply(_console, ["[INFO]"].concat(args));
    } else {
      var _console2;
      (_console2 = console).error.apply(_console2, ["[INFO]"].concat(args));
    }
  },
  error: function error() {
    var _console3;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    (_console3 = console).error.apply(_console3, ["[ERROR]"].concat(args));
  }
};
function writeLogs(name, value) {
  if (process.env["NODE_ENV"] !== "development") return;
  try {
    var logsDir = "logs";
    var logPath = "".concat(logsDir, "/").concat(name);

    // Check if we can write to the current directory
    _fs.default.accessSync(process.cwd(), _fs.default.constants.W_OK);

    // Create logs directory if it doesn't exist
    if (!_fs.default.existsSync(logsDir)) {
      _fs.default.mkdirSync(logsDir, {
        recursive: true
      });
    }
    _fs.default.writeFileSync(logPath, JSON.stringify(value, null, 2));
    Logger.log("Debug log written to: ".concat(logPath));
  } catch (error) {
    var errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log("Failed to write logs to ".concat(name, ": ").concat(errorMessage));
  }
}