const fs = require("fs");
const path = require("path");
const { DOMParser } = require("xmldom");
const { getTopicRef } = require("../state/topicData");

async function xRefPathFixer(outputFolderPath) {
  try {
    const files = await fs.promises.readdir(outputFolderPath);

    const fileProcessingPromises = [];

    for (const file of files) {
      const filePath = path.join(outputFolderPath, file);

      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) {
        fileProcessingPromises.push(xRefPathFixer(filePath));
      } else if (stats.isFile() && file.endsWith(".dita")) {
        fileProcessingPromises.push(processDitaFile(filePath));
      }
    }

    // Wait for all file processing promises to resolve
    await Promise.all(fileProcessingPromises);
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

async function processDitaFile(filePath) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf8");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileData, "text/xml");

    const xrefElements = Array.from(xmlDoc.getElementsByTagName("xref"));
    filePath = filePath.replace(/\\/g, "/");

    const getTopicElement = () => {
      return (
        xmlDoc.getElementsByTagName("topic")[0] ||
        xmlDoc.getElementsByTagName("concept")[0] ||
        xmlDoc.getElementsByTagName("reference")[0] ||
        xmlDoc.getElementsByTagName("task")[0]
      );
    };

    const updateXrefAttributes = (xref, calculatedPath) => {
      xref.setAttribute("href", calculatedPath);
      xref.setAttribute("scope", "local");
      xref.setAttribute("format", "dita");
    };

    for (const xref of xrefElements) {
      let topicData = getTopicRef();
      const href = xref.getAttribute("href");
      const hrefParts = href.split("/");
      const lastPart = hrefParts[hrefParts.length - 1];

      if (lastPart.endsWith(".html")) {
        let matches = topicData.filter((data) => data.fileName === lastPart);

        if (matches.length > 1) {
          matches = matches.filter((data) => data.titleType === "h1");
        }

        if (matches.length > 0) {
          let { topicId, outputFilePath } = matches[0];
          let modiPath = outputFilePath
            .split("/")
            .filter((x) => x !== ".")
            .join("/")
            .toLowerCase();
          let fullPath = `${modiPath}#${topicId}`;
          let calculatedPath = getRelativePath(filePath, fullPath).replace(
            /\\/g,
            "/"
          );

          updateXrefAttributes(xref, calculatedPath);
        }
      } else if (href.startsWith("#")) {
        let topicElement = getTopicElement();

        if (topicElement) {
          let id = topicElement.getAttribute("id");
          let matches = topicData.filter((data) => data.topicId === id);

          if (matches.length > 0) {
            let { outputFilePath } = matches[0];
            let modiPath = outputFilePath
              .split("/")
              .filter((x) => x !== ".")
              .join("/")
              .toLowerCase();
            let newPath = `${modiPath}#${id}`;
            let calculatedPath = getRelativePath(filePath, newPath).replace(
              /\\/g,
              "/"
            );

            updateXrefAttributes(xref, calculatedPath);
          }
        }
      } else if (href.includes(".action?") || href.includes("+")) {
        xref.setAttribute("scope", "external");
        xref.setAttribute("format", "html");
      }
    }

    const modifiedData = xmlDoc.toString();
    await fs.promises.writeFile(filePath, modifiedData, "utf8");
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}

function getRelativePath(from, to) {
  const [toPath, fragment] = to.split("#");
  const relativePath = path.relative(path.dirname(from), toPath);
  return fragment ? `${relativePath}#${fragment}` : relativePath;
}

module.exports = xRefPathFixer;
