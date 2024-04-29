const configObject = require("../config/config.js");
const { node_env } = configObject;

class LoggerController {
  testingLogger(req, res) {
    req.logger.error("Error message");
    req.logger.warn("Warning message");
    req.logger.info("Info message");
    req.logger.debug("Debug message");
    console.log(`The environment is ${node_env}`);
    res.send("Logs test");
  }
}

module.exports = LoggerController;
