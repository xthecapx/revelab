const fs = require("fs");
const path = require("path");
const { transform } = require("lightningcss");
const { brotliCompress, constants } = require("zlib");

const { version } = require("./package.json");

const dirs = ["themes", "base", "components", "layouts", "utilities"];
const banner = `/* revelab — Slide components for Reveal.js */\n/* https://github.com/xthecapx/revelab */\n`;
const minBanner = `/* revelab v${version} | MIT | github.com/xthecapx/revelab */\n`;

let output = banner;

for (const dir of dirs) {
  const fullPath = path.join(__dirname, "src", dir);
  if (!fs.existsSync(fullPath)) continue;

  output += `\n/* === ${dir.toUpperCase()} === */\n`;

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".css")).sort();
  for (const file of files) {
    const css = fs.readFileSync(path.join(fullPath, file), "utf8");
    output += `\n/* -- ${file.replace(".css", "")} -- */\n${css}\n`;
  }
}

const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

fs.writeFileSync(path.join(distDir, "revelab.css"), output);

const { code } = transform({
  filename: "revelab.css",
  code: Buffer.from(output),
  minify: true,
});

const minified = minBanner + code.toString();
fs.writeFileSync(path.join(distDir, "revelab.min.css"), minified);

function brotliSize(content) {
  return new Promise((resolve, reject) => {
    brotliCompress(
      content,
      { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } },
      (err, result) => (err ? reject(err) : resolve(result.length))
    );
  });
}

async function report() {
  const files = ["revelab.css", "revelab.min.css"];
  const rows = [];

  for (const file of files) {
    const filePath = path.join(distDir, file);
    const content = fs.readFileSync(filePath);
    const raw = (content.length / 1024).toFixed(2);
    const br = ((await brotliSize(content)) / 1024).toFixed(2);
    rows.push({ file, "raw (KB)": raw, "brotli (KB)": br });
  }

  console.table(rows);
}

report();
