// src/data/pkg-name.ts
var packageName = "astro-svg-sprite";

// src/paths.ts
import fs from "node:fs";
function getEntryPath(entry) {
  const defaultPath = "./src/assets/images/sprite";
  if (!entry || entry === "") {
    return defaultPath;
  } else if (typeof entry === "string") {
    return entry;
  } else if (Array.isArray(entry)) {
    const nonEmptyPaths = entry.filter((path) => path && path !== "");
    if (nonEmptyPaths.length > 0) {
      return nonEmptyPaths;
    }
  }
  return defaultPath;
}
function getOutputPath(output) {
  if (!output || output === "") {
    return "assets/images";
  } else {
    return output;
  }
}

// src/utils/logger.ts
var Logger = class {
  colors = {
    reset: "\x1B[0m",
    fg: {
      red: "\x1B[31m",
      green: "\x1B[32m",
      yellow: "\x1B[33m",
      cyanBold: "\x1B[1m\x1B[36m"
    }
  };
  packageName;
  constructor(packageName2) {
    this.packageName = packageName2;
  }
  log(msg, prefix = "") {
    const s = msg.join("\n");
    const now = /* @__PURE__ */ new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeMsg = `\x1B[2m${hours}:${minutes}:${seconds}\x1B[22m`;
    console.log(
      `${timeMsg} %s[${this.packageName}]%s ${s}`,
      prefix,
      prefix ? this.colors.reset : ""
    );
  }
  info(...msg) {
    this.log(msg, this.colors.fg.cyanBold);
  }
  success(...msg) {
    this.log(msg, this.colors.fg.cyanBold);
  }
  warn(...msg) {
    this.log([`${this.colors.fg.yellow}(!)${this.colors.reset} ${msg}`], this.colors.fg.cyanBold);
  }
  error(...msg) {
    this.log([`${this.colors.fg.red}failed!${this.colors.reset}`, ...msg], this.colors.fg.cyanBold);
  }
};

// src/utils/extractAttributes.ts
function extractAttributes(content) {
  const viewBoxPattern = /viewBox="([^"]*)"/;
  const fillPattern = /fill="([^"]*)"/;
  const viewBoxMatch = content.match(viewBoxPattern);
  const fillMatch = content.match(fillPattern);
  const viewBoxAttr = viewBoxMatch && viewBoxMatch[0] ? viewBoxMatch[0] : "";
  const fillAttr = fillMatch && fillMatch[0] ? fillMatch[0] : "";
  return `${viewBoxAttr} ${fillAttr}`;
}

// src/utils/extractSvgContent.ts
function extractSvgContent(svgContent) {
  const startTag = "<svg";
  const endTag = "</svg>";
  const startIndex = svgContent.indexOf(startTag);
  const endIndex = svgContent.indexOf(endTag);
  if (startIndex !== -1 && endIndex !== -1) {
    const startTagEndIndex = svgContent.indexOf(">", startIndex);
    const content = svgContent.slice(startTagEndIndex + 1, endIndex).trim();
    return content;
  }
  return "";
}

// src/utils/hasSvgFilesInDirectory.ts
function hasSvgFilesInDirectory(dir) {
  if (typeof dir === "string") {
    const files = fs.readdirSync(dir);
    return files.some((filename) => filename.endsWith(".svg"));
  } else if (Array.isArray(dir)) {
    return dir.some((subDir) => {
      const files = fs.readdirSync(subDir);
      return files.some((filename) => filename.endsWith(".svg"));
    });
  }
  return false;
}

// src/utils/isVaridSvg.ts
function isValidSvg(content) {
  return content.includes("<svg") && content.includes("</svg>");
}

// src/utils/measureExecutionTime.ts
function measureExecutionTime(callback) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const executionTime2 = Math.floor(endTime - startTime);
  return executionTime2;
}

// src/utils/index.ts
var logger = new Logger(packageName);

// src/core/parseSvgs.ts
var icons = [];
var invalidFiles = [];
var fileNames = [];
function parseSingleDirectory(directory) {
  fs.readdirSync(directory).forEach((filename) => {
    if (!filename.toLowerCase().endsWith(".svg")) {
      return;
    }
    const icon = fs.readFileSync(`${directory}/${filename}`, "utf-8");
    if (!isValidSvg(icon)) {
      invalidFiles.push(`${directory}/${filename}`);
      fileNames.push(`${directory}/${filename}`);
    } else {
      fileNames.push(`${directory}/${filename}`);
    }
    if (isValidSvg(icon)) {
      icons.push({
        name: filename.replace(/\.svg$/, ""),
        content: icon
      });
    }
  });
}
function parseDirectory(directory) {
  if (typeof directory === "string") {
    parseSingleDirectory(directory);
  } else if (Array.isArray(directory)) {
    directory.forEach((dir) => parseSingleDirectory(dir));
  }
}
function parseSvgs(dir) {
  if (!hasSvgFilesInDirectory(dir)) {
    return icons;
  }
  if (typeof dir === "string") {
    parseDirectory(dir);
  } else if (Array.isArray(dir)) {
    dir.forEach((directory) => parseDirectory(directory));
  }
  return icons;
}

// src/core/gernerateSprite.ts
function generateSprite(icons2) {
  let sprite = '<svg xmlns="http://www.w3.org/2000/svg" class="svg-sprite">';
  icons2.forEach((icon) => {
    sprite += `
      <symbol class="svg-sprite" id="${icon.name}" ${extractAttributes(icon.content)}>
        ${extractSvgContent(icon.content)}  
      </symbol>
    `;
  });
  sprite += "</svg>";
  return sprite;
}

// src/core/writeFile.ts
function writeFile(path, content) {
  console.log("PASCAL");
  console.trace(path);
  if (!fs.existsSync(path)) {
    const dirname = path.substr(0, path.lastIndexOf("/"));
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(path, "", "utf-8");
  }
  fs.writeFileSync(path, content, "utf-8");
}

// src/utils/svg-optimizer/tags/circle.ts
function convertCircleToPath(content) {
  const circleRegex = /<circle([^>]*)\/?>/g;
  const transformedContent = content.replace(circleRegex, (match, attributes) => {
    const attributesRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    const circleAttributes = {};
    let attributeMatch;
    while ((attributeMatch = attributesRegex.exec(attributes)) !== null) {
      const [, attributeName, attributeValue] = attributeMatch;
      circleAttributes[attributeName] = attributeValue;
    }
    const { cx, cy, r, ...restAttributes } = circleAttributes;
    const d = `M${Number(cx) - Number(r)},${cy}A${r},${r} 0 1,0 ${Number(cx) + Number(r)},${cy}A${r},${r} 0 1,0 ${Number(cx) - Number(r)},${cy}`;
    const pathAttributes = Object.entries(restAttributes).map(([name, value]) => `${name}="${value}"`).join(" ");
    return `<path d="${d}" ${pathAttributes}></path>`;
  });
  return transformedContent;
}

// src/utils/svg-optimizer/tags/ellipse.ts
function convertEllipseToPath(content) {
  const ellipseRegex = /<ellipse([^>]*)\/?>/g;
  const transformedContent = content.replace(ellipseRegex, (match, attributes) => {
    const attributesRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    const ellipseAttributes = {};
    let attributeMatch;
    while ((attributeMatch = attributesRegex.exec(attributes)) !== null) {
      const [, attributeName, attributeValue] = attributeMatch;
      ellipseAttributes[attributeName] = attributeValue;
    }
    const { cx, cy, rx, ry, ...restAttributes } = ellipseAttributes;
    const d = `M${Number(cx) - Number(rx)},${cy}A${rx},${ry} 0 1,0 ${Number(cx) + Number(rx)},${cy}A${rx},${ry} 0 1,0 ${Number(cx) - Number(rx)},${cy}`;
    const pathAttributes = Object.entries(restAttributes).map(([name, value]) => `${name}="${value}"`).join(" ");
    return `<path d="${d}" ${pathAttributes}></path>`;
  });
  return transformedContent;
}

// src/utils/svg-optimizer/tags/line.ts
function convertLineToPath(content) {
  const lineRegex = /<line([^>]*)\/?>/g;
  const transformedContent = content.replace(lineRegex, (match, attributes) => {
    const attributesRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    const lineAttributes = {};
    let attributeMatch;
    while ((attributeMatch = attributesRegex.exec(attributes)) !== null) {
      const [, attributeName, attributeValue] = attributeMatch;
      lineAttributes[attributeName] = attributeValue;
    }
    const { x1, y1, x2, y2, ...restAttributes } = lineAttributes;
    const d = `M ${x1},${y1} L ${x2},${y2}`;
    const pathAttributes = Object.entries(restAttributes).map(([name, value]) => `${name}="${value}"`).join(" ");
    return `<path d="${d}" ${pathAttributes}></path>`;
  });
  return transformedContent;
}

// src/utils/svg-optimizer/utils/parse-points.ts
function parsePoints(points) {
  return points.split(/\s+/).map((point) => Number(point));
}

// src/utils/svg-optimizer/tags/polygon.ts
function convertPolygonToPath(content) {
  const polygonRegex = /<polygon([^>]*)\/?>/g;
  const transformedContent = content.replace(polygonRegex, (match, attributes) => {
    const attributesRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    const polygonAttributes = {};
    let attributeMatch;
    while ((attributeMatch = attributesRegex.exec(attributes)) !== null) {
      const [, attributeName, attributeValue] = attributeMatch;
      polygonAttributes[attributeName] = attributeValue;
    }
    const { points, ...restAttributes } = polygonAttributes;
    const d = `M ${parsePoints(points).join(" ")} Z`;
    const pathAttributes = Object.entries(restAttributes).map(([name, value]) => `${name}="${value}"`).join(" ");
    return `<path d="${d}" ${pathAttributes}></path>`;
  });
  return transformedContent;
}

// src/utils/svg-optimizer/tags/polyline.ts
function convertPolylineToPath(content) {
  const polylineRegex = /<polyline([^>]*)\/?>/g;
  const transformedContent = content.replace(polylineRegex, (match, attributes) => {
    const attributesRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    const polylineAttributes = {};
    let attributeMatch;
    while ((attributeMatch = attributesRegex.exec(attributes)) !== null) {
      const [, attributeName, attributeValue] = attributeMatch;
      polylineAttributes[attributeName] = attributeValue;
    }
    const { points, ...restAttributes } = polylineAttributes;
    const d = `M ${parsePoints(points).join(" ")}`;
    const pathAttributes = Object.entries(restAttributes).map(([name, value]) => `${name}="${value}"`).join(" ");
    return `<path d="${d}" ${pathAttributes}></path>`;
  });
  return transformedContent;
}

// src/utils/svg-optimizer/index.ts
function optimizeSvgSprite(content) {
  content = convertCircleToPath(content);
  content = convertEllipseToPath(content);
  content = convertLineToPath(content);
  content = convertPolygonToPath(content);
  content = convertPolylineToPath(content);
  return content;
}

// src/utils/compressOptions.ts
function removeTagsFromSvgContent(content) {
  const tagsToRemove = ["g", "defs", "metadata", "title", "desc", "marker"];
  for (const tag of tagsToRemove) {
    const openTagRegex = new RegExp(`<${tag}\\b[^>]*>`, "g");
    const closeTagRegex = new RegExp(`</${tag}\\s*>`, "g");
    content = content.replace(openTagRegex, "");
    content = content.replace(closeTagRegex, "");
  }
  return content;
}
function compressFast(content) {
  return content.replace(/>\s+</g, "><").replace(/\s+(?==|>)/g, "").replace(/(\r\n|\n|\r|\t)/g, "");
}
function compressStandard(content) {
  content = compressFast(content);
  content = removeTagsFromSvgContent(content);
  return content.replace(/<(\w+)><\/\1>/g, "").replace(/"/g, "'").replace(/([a-zA-Z-]+)\s*=\s*([a-zA-Z0-9-]+)/g, "$1=$2").replace(/style="([^"]+)"/g, (match, style) => {
    const css = style.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/ +/g, " ");
    return `style="${css}"`;
  });
}
function compressBest(content) {
  content = compressStandard(content);
  content = optimizeSvgSprite(content);
  return content;
}

// src/core/optimizeSvgContent.ts
function optimizeSvgContent(content, options) {
  switch (options) {
    case "best":
      content = compressBest(content);
      break;
    case "standard":
    case void 0:
      content = compressStandard(content);
      break;
    case "fast":
      content = compressFast(content);
      break;
    default:
      break;
  }
  return content;
}

// src/core/printWarnInfo.ts
function fileForm(files) {
  return files.length === 1 ? "file" : "files";
}
function printWarnInfo() {
  if (invalidFiles.length > 0) {
    console.log(`
\x1B[42m parsed ${fileNames.length} SVG ${fileForm(fileNames)} \x1B[0m`);
    const warnMsg = [
      `
\x1B[33m(!) Please provide a standard svg ${fileForm(invalidFiles)}.`,
      `\x1B[1m${fileForm(invalidFiles)}:\x1B[22m ${JSON.stringify(invalidFiles, null, 2)}`,
      `   \x1B[1mNot a valid SVG file.\x1B[22m
`,
      `\x1B[33m- To remove the warning information, delete or remove the SVG ${fileForm(invalidFiles)}.`,
      `- Visit \x1B[4mhttps://developer.mozilla.org/en-US/docs/Web/SVG\x1B[24m know more about SVG.\x1B[0m
`
    ];
    console.log(`${warnMsg.join("\n")}`);
  }
}

// src/core/printFileStats.ts
function printFileStats(filePath, outputPath) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      logger.error("Could not read file information:", `${err}`);
      return;
    }
    const fileSizeInBytes = stats.size;
    const fileSizeInKilobytes = fileSizeInBytes / 1024;
    logger.info(`\x1B[2mCompleted in ${executionTime}ms.\x1B[22m`);
    printWarnInfo();
    logger.success(`\x1B[32mgenerated\x1B[0m 'sprite.svg' ${fileSizeInKilobytes}(kb).`);
  });
}

// src/core/vitePluginSvgSprite.ts
async function vitePluginSvgSprite(tags, compressHTML) {
  let htmlTags;
  if (compressHTML) {
    htmlTags = `${tags.replaceAll("\n", "")}`;
  } else {
    htmlTags = `

<!--astro-svg-sprite-->
${tags.replace(/(?<!\n)\n\n+(?!\n)/g, "\n")}
<!--astro-svg-sprite-->
	`;
  }
  return {
    name: "vite-plugin-spriter",
    enforce: "pre",
    transform(html) {
      try {
        return html.replace("</body>", `${htmlTags}</body>`);
      } catch (error) {
        throw error;
      }
    }
  };
}

// src/index.ts
import { fileURLToPath } from "url";
var config = {
  emitFile: true
};
var defaultConfig = {
  include: "./src/assets/images/sprite",
  mode: "verbose",
  emitFile: {
    compress: "standard",
    path: "assets/images"
  },
  ...config
};
var executionTime;
function svgSprite(astroConfig = {}) {
  var _a, _b;
  let filePath;
  let config2;
  const mergedConfig = { ...defaultConfig, ...astroConfig };
  const entry = getEntryPath(astroConfig.include);
  const output = getOutputPath((_a = astroConfig.emitFile) == null ? void 0 : _a.path);
  const icons2 = parseSvgs(entry);
  const sprite = optimizeSvgContent(generateSprite(icons2), (_b = mergedConfig.emitFile) == null ? void 0 : _b.compress);
  function emitFile() {
    if (hasSvgFilesInDirectory(entry)) {
      if (astroConfig.emitFile || mergedConfig.emitFile) {
        if (icons2.length !== 0) {
          writeFile(filePath, sprite);
        }
        if (mergedConfig.mode !== "quiet") {
          printFileStats(filePath, output);
        }
      }
    }
  }
  return {
    name: packageName,
    hooks: {
      "astro:config:setup": async ({ updateConfig, config: config3 }) => {
        if ((astroConfig == null ? void 0 : astroConfig.emitFile) !== void 0 || (astroConfig == null ? void 0 : astroConfig.emitFile) === false) {
          updateConfig({ vite: { plugins: [vitePluginSvgSprite(sprite, config3.compressHTML)] } });
        }
      },
      "astro:config:done": async ({ config: cfg }) => {
        config2 = cfg;
        filePath = `${fileURLToPath(config2.publicDir)}${output}/sprite.svg`;
      },
      "astro:server:start": async () => {
        executionTime = measureExecutionTime(emitFile);
      },
      "astro:build:start": async () => {
        executionTime = measureExecutionTime(emitFile);
      }
    }
  };
}
export {
  svgSprite as default,
  executionTime
};
