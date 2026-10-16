let plugin;
try {
  plugin = require("tailwindcss/plugin");
} catch {
  plugin = null;
}

const fs = require("fs");
const path = require("path");

function loadCSS(dir) {
  const fullPath = path.join(__dirname, "src", dir);
  if (!fs.existsSync(fullPath)) return "";
  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".css"))
    .sort()
    .map((f) => fs.readFileSync(path.join(fullPath, f), "utf8"))
    .join("\n");
}

// PostCSS preserves comments, nested @media rules and declaration values.
// A regular expression cannot distinguish these from ordinary selectors.
function cssToObject(css, shouldInclude = () => true) {
  const postcss = require("postcss");
  function convert(container, result = {}) {
    for (const node of container.nodes || []) {
      if (node.type === "rule") {
        if (!shouldInclude(node.selector)) continue;
        const props = result[node.selector] || {};
        for (const decl of node.nodes) {
          if (decl.type !== "decl") continue;
          const value = decl.value + (decl.important ? " !important" : "");
          // Preserve fallback declarations, e.g. a color before color-mix().
          if (Object.hasOwn(props, decl.prop)) {
            props[decl.prop] = [].concat(props[decl.prop], value);
          } else {
            props[decl.prop] = value;
          }
        }
        result[node.selector] = props;
      } else if (node.type === "atrule" && node.nodes) {
        const key = `@${node.name}${node.params ? " " + node.params : ""}`;
        const children = convert(node, result[key] || {});
        if (Object.keys(children).length) {
          result[key] = children;
        }
      }
    }
    return result;
  }
  return convert(postcss.parse(css));
}

if (plugin) {
  module.exports = plugin.withOptions(
    (options = {}) => {
      const { include, exclude } = options;

      return ({ addBase, addComponents, addUtilities }) => {
        const themeCSS = loadCSS("themes");
        const baseCSS = loadCSS("base");
        const componentsCSS = loadCSS("components");
        const layoutsCSS = loadCSS("layouts");
        const utilitiesCSS = loadCSS("utilities");

        function shouldInclude(selector) {
          if (include && !include.some((pat) => selector.includes(pat)))
            return false;
          if (exclude && exclude.some((pat) => selector.includes(pat)))
            return false;
          return true;
        }

        addBase(cssToObject(themeCSS));
        addBase(cssToObject(baseCSS));
        addComponents(cssToObject(componentsCSS + "\n" + layoutsCSS, shouldInclude));
        addUtilities(cssToObject(utilitiesCSS, shouldInclude));
      };
    },
    () => ({})
  );
} else {
  module.exports = {
    css: path.join(__dirname, "dist", "revelab.css"),
  };
}
