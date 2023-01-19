const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./src",
});

const customConfig = {};

module.exports = createJestConfig(customConfig);