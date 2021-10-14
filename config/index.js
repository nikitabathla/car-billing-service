const convict = require("convict");
const path = require("path");
const configs = require("./config");

let config = convict({
  configs,
});

const pp = path.resolve(__dirname, "..", "config", "config.json");
config.loadFile(pp);

module.exports = config._instance.configs;
