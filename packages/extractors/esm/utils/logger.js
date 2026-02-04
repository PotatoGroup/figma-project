import fs from "fs";
export var Logger = {
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
export function writeLogs(name, value) {
  if (process.env["NODE_ENV"] !== "development") return;
  try {
    var logsDir = "logs";
    var logPath = "".concat(logsDir, "/").concat(name);

    // Check if we can write to the current directory
    fs.accessSync(process.cwd(), fs.constants.W_OK);

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, {
        recursive: true
      });
    }
    fs.writeFileSync(logPath, JSON.stringify(value, null, 2));
    Logger.log("Debug log written to: ".concat(logPath));
  } catch (error) {
    var errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log("Failed to write logs to ".concat(name, ": ").concat(errorMessage));
  }
}