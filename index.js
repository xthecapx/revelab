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

function parseCSS(css) {
  const rules = [];
  const regex = /([^{}]+)\{([^{}]+)\}/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const selector = match[1].trim();
    const propsStr = match[2].trim();
    const props = {};
    propsStr.split(";").forEach((prop) => {
      const [key, ...valParts] = prop.split(":");
      if (key && valParts.length) {
        props[key.trim()] = valParts.join(":").trim();
      }
    });
    if (Object.keys(props).length) {
      rules.push({ selector, props });
    }
  }
  return rules;
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

        const themeRules = parseCSS(themeCSS);
        const baseRules = parseCSS(baseCSS);
        const componentRules = parseCSS(componentsCSS + "\n" + layoutsCSS);
        const utilityRules = parseCSS(utilitiesCSS);

        function shouldInclude(selector) {
          if (include && !include.some((pat) => selector.includes(pat)))
            return false;
          if (exclude && exclude.some((pat) => selector.includes(pat)))
            return false;
          return true;
        }

        function rulesToObj(rules, filter = true) {
          const obj = {};
          rules.forEach(({ selector, props }) => {
            if (filter && !shouldInclude(selector)) return;
            obj[selector] = props;
          });
          return obj;
        }

        addBase(rulesToObj(themeRules, false));
        addBase(rulesToObj(baseRules, false));
        addComponents(rulesToObj(componentRules));
        addUtilities(rulesToObj(utilityRules));
      };
    },
    () => ({})
  );
} else {
  module.exports = {
    css: path.join(__dirname, "dist", "revelab.css"),
  };
}
