const xmlFormat = require("xml-formatter");
const createDirectory = require("./createDirectory.js");
const { addData } = require("../state/ditaMap.js");
const fixImagePath = require("./fixImagePath.js");

const path = require("path");
const fs = require("fs");
const { capitalizeFirstWord } = require("./helper.js");
const xrefDataAttribute = require("./xrefDataAttribute.js");
const FinalTagsCleanUp = require("./FinalTagsCleanUp.js");

const cheerio = require("cheerio");

function processAndWriteData(
  tc,
  dtdType,
  newPath,
  outputDirName,
  fileInfo,
  filePath
) {
  let fileNameOnTitle =
    tc.title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9]+/g, "") + ".dita";

  let actualPath =
    newPath.split("/").slice(0, -1).join("/") + "/" + fileNameOnTitle;

  if (actualPath.startsWith("/")) {
    actualPath = actualPath.slice(1);
  }

  let outputFilePath = `${outputDirName}${actualPath}`;

  outputFilePath = outputFilePath.replace(/[()]/g, "");
  const outputDir = path.dirname(outputFilePath);

  createDirectory(outputDirName);
  createDirectory(outputDir.toLowerCase());

  fileInfo.nestObj.push({
    title: tc.title,
    level: tc.level,
    path: outputFilePath,
    child: [],
  });

  xrefDataAttribute(tc.content, filePath, outputFilePath);
  let newfixImagePath = fixImagePath(tc.content, outputFilePath);

  let finalTagsCleanUp = FinalTagsCleanUp(newfixImagePath);

  // Fixing the missing columns by adding <entry/> in the table
  const $ = cheerio.load(finalTagsCleanUp, { xmlMode: true });

  // $("table tgroup").each((i, table) => {
  //   const cols = parseInt($(table).attr("cols"));
  //   $(table)
  //     .find("row")
  //     .each((j, row) => {
  //       const entries = $(row).find("entry");
  //       let hasNamest = false;
  //       let hasNameend = false;
  //       entries.each((index, entry) => {
  //         if ($(entry).attr("namest")) {
  //           hasNamest = true;
  //         }
  //         if ($(entry).attr("nameend")) {
  //           hasNameend = true;
  //         }
  //       });
  //       if (!hasNamest && !hasNameend && entries.length < cols) {
  //         const missingCols = cols - entries.length;
  //         for (let k = 0; k < missingCols; k++) {
  //           $(row).append("<entry/>");
  //         }
  //       }
  //     });
  // });

  // $("entry > p > table.tgroup").each((i, table) => {
  //   const cols = parseInt($(table).attr("cols"));
  //   $(table)
  //     .find("row")
  //     .each((j, row) => {
  //       const entries = $(row).find("entry");
  //       let hasNamest = false;
  //       let hasNameend = false;
  //       entries.each((index, entry) => {
  //         if ($(entry).attr("namest")) {
  //           hasNamest = true;
  //         }
  //         if ($(entry).attr("nameend")) {
  //           hasNameend = true;
  //         }
  //       });
  //       if (!hasNamest && !hasNameend && entries.length < cols) {
  //         const missingCols = cols - entries.length;
  //         for (let k = 0; k < missingCols; k++) {
  //           $(row).append("<entry/>");
  //         }
  //       }
  //     });
  // });

  $("table > tgroup").each((i, table) => {
    const cols = parseInt($(table).attr("cols"));
    $(table)
      .find("> tbody > row")
      .each((j, row) => {
        const entries = $(row).find("> entry");
        let hasNamest = false;
        let hasNameend = false;
        entries.each((index, entry) => {
          if ($(entry).attr("namest")) {
            hasNamest = true;
          }
          if ($(entry).attr("nameend")) {
            hasNameend = true;
          }
        });
        if (!hasNamest && !hasNameend && entries.length < cols) {
          const missingCols = cols - entries.length;
          for (let k = 0; k < missingCols; k++) {
            $(row).append("<entry/>");
          }
        }
      });
  });

  finalTagsCleanUp = $.xml();

  fs.writeFileSync(
    outputFilePath.toLowerCase(),
    xmlFormat(
      `<?xml version="1.0" encoding="UTF-8"?>\n 
                                <!DOCTYPE ${dtdType} PUBLIC "-//OASIS//DTD DITA ${capitalizeFirstWord(
        dtdType
      )}//EN" "${dtdType}.dtd">
                                ` + finalTagsCleanUp,
      {
        indentation: "  ",
        filter: (node) => node.type !== "Comment",
        collapseContent: true,
        lineSeparator: "\n",
      }
    ),
    "utf-8"
  );

  addData(fileInfo);
}

module.exports = processAndWriteData;
