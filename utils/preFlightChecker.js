const fs = require("fs");
const path = require("path");
const { DOMParser } = require("xmldom");

async function preFlightChecker(inputFolderDir) {
  try {
    const files = await fs.promises.readdir(inputFolderDir);

    const results = [];

    for (const file of files) {
      const filePath = path.join(inputFolderDir, file);
      const stats = await fs.promises.stat(filePath);

      if (stats.isDirectory()) {
        const subDirResults = await preFlightChecker(filePath);
        results.push(...subDirResults);
      } else if (stats.isFile() && file.endsWith(".html")) {
        const result = await checkHtmlStartsWithHeading(filePath);

        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

async function checkHtmlStartsWithHeading(filePath) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf8");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileData, "text/html");

    const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
    let modifiedFilePath = filePath.split("input").pop();

    for (const tag of headingTags) {
      const tags = xmlDoc.getElementsByTagName(tag);
      if (tags.length > 0) {
        return { filePath: modifiedFilePath, title: true, heading: tag };
      }
    }

    return { filePath: modifiedFilePath, title: false };
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}
module.exports = preFlightChecker;
