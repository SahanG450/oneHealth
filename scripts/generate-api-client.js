// Regenerates packages/api-client from the backend's OpenAPI spec.
// Run: node scripts/generate-api-client.js
const { execSync } = require("child_process");
execSync("npm run generate -w packages/api-client", { stdio: "inherit" });
