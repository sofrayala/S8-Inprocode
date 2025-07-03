const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env["SUPABASE_URL"];
const SUPABASE_KEY = process.env["SUPABASE_KEY"];
const MAPBOX_ACCESS_TOKEN = process.env["MAPBOX_ACCESS_TOKEN"];

const envDir = path.resolve(__dirname, "../src/environments");
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const environmentFileContent = `export const environment = {
  production: false,
  ///////////update your keys here
  supabaseUrl: '${SUPABASE_URL}',
  supabaseKey: '${SUPABASE_KEY}',
  mapBoxAccessToken: '${MAPBOX_ACCESS_TOKEN}'
};
`;

fs.writeFileSync(path.join(envDir, "environment.ts"), environmentFileContent);

fs.writeFileSync(
  path.join(envDir, "environment.development.ts"),
  environmentFileContent
);
