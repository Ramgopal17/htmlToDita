const fs = require("fs");
const path = require("path");
const logFileGenerator = require("./logFileGenerator");
const extractHTML = require("./extractHTML");
const { HTMLToJSON } = require("html-to-json-parser");
const { JSONToHTML } = require("html-to-json-parser");

const beautify = require("js-beautify").html;

const removeUnwantedElements = require("./removeUnwantedElements");
const characterToEntity = require("./characterToEntity");

const cheerio = require("cheerio");
const moveTgroupClosingTagBeforeTable = require("./moveTgroupClosingTagBeforeTable");
const addTopicTag = require("./addTopicTag");
const colMergeFixer = require("./colMergeFixer");
const SortTopicsTags = require("./SortTopicsTags");
const fileSeparator = require("./fileSeparator");

const { getLogData, addSkippedFiles } = require("../state/logData.js");
const processTopicWise = require("./processTopicWise.js");
const { isFileReady } = require("./helper.js");
const colFixerWithoutHeadTag = require("./colFixerWithoutHeadTag.js");

const outputDirName = "./output/";

async function checkFilesInFolder(folderPath) {
  try {
    const files = await fs.promises.readdir(folderPath);

    // Array to store promises returned by processing individual files
    const fileProcessingPromises = [];

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) {
        // Recursively process directories
        fileProcessingPromises.push(checkFilesInFolder(filePath));
      } else if (stats.isFile()) {
        if (file.endsWith(".html")) {
          // Process individual files
          fileProcessingPromises.push(
            mainMethod({ name: file, path: filePath }, stats)
          );
        } else {
          addSkippedFiles(filePath);
        }
      }
    }

    // Wait for all file processing promises to resolve
    await Promise.all(fileProcessingPromises);

    // Generate log files
    let logger = getLogData();
    logFileGenerator(logger, outputDirName);
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error; // Propagate the error up
  }
}

async function mainMethod(filePath, stats) {
  const fileInfo = { file: filePath.path.replace(/\\/g, "/") };

  try {
    if (stats.isFile()) {
      const ready = await isFileReady(filePath.path);

      if (ready) {
        const fileData = fs.readFileSync(filePath.path, {
          encoding: "utf8",
          flag: "r",
        });

        // Beautify the HTML content
        const formattedHtml = beautify(fileData, {
          indent_size: 2,
        });

        // Load the formatted HTML content using cheerio
        const $ = cheerio.load(formattedHtml);

        $("colgroup").remove();

        let thsWithColspan = 0;

        $("table").each((index, element) => {
          $(element)
            .find("th")
            .each((index, th) => {
              const colspanValue = $(th).attr("colspan");
              if (colspanValue && parseInt(colspanValue) >= 2) {
                thsWithColspan++;
              }
            });
        });

        // If there are no th elements with colspan >= 2, then add colgroup and colspec elements
        $("table").each((index, element) => {
          const firstTbody = $(element).find("tbody").first();
          const firstTbodyFirstTr = firstTbody.find("tr").first();
          const secondTbodyFirstTr = firstTbody.find("tr").eq(1);

          const getColCount = (tr) => {
            let colCount = 0;
            tr.children("td, th").each((i, cell) => {
              const colspan = parseInt($(cell).attr("colspan"), 10) || 1;
              colCount += colspan;
            });
            return colCount;
          };

          let numColsFirstTr = getColCount(firstTbodyFirstTr);
          let numColsSecondTr = getColCount(secondTbodyFirstTr);
          let numCols = Math.max(numColsFirstTr, numColsSecondTr);

          $(element).prepend(`<tgroup cols="${numCols}"></tgroup>`);
          for (let i = 1; i <= numCols; i++) {
            $(element).find("tgroup").append(`<colspec colname="c${i}"/>`);
          }

          const processCols = (rowSelector, cellSelector) => {
            $(element)
              .find(rowSelector)
              .each((i, tr) => {
                // Filter out nested <tr> elements
                if ($(tr).closest("table").is($(element))) {
                  let currentColIndex = 1;
                  $(tr)
                    .find(cellSelector)
                    .each((j, cell) => {
                      const colspan =
                        parseInt($(cell).attr("colspan"), 10) || 1;
                      const startColIndex = currentColIndex;
                      const endColIndex = startColIndex + colspan - 1;
                      $(cell)
                        .attr("namest", `c${startColIndex}`)
                        .attr("nameend", `c${endColIndex}`);
                      currentColIndex = endColIndex + 1;
                    });
                }
              });
          };

          // Process thead and tbody cells
          processCols("thead tr", "th, td");
          processCols("tbody tr", "td, th");
        });

        const contentWithHmtlAsRootElement = extractHTML($.html());

        let result = await HTMLToJSON(contentWithHmtlAsRootElement, false);

        result = removeUnwantedElements(
          result,
          {} /*parent tag details*/,
          "" /*parent div class*/
        );

        result = characterToEntity(result);

        // Proceed with further operations
        try {
          // Replace <> and </> tags
          const cleanedUpContent = (await JSONToHTML(result)).replace(
            /<\/*>/g,
            ""
          );
          const cleanedUpJson = await HTMLToJSON(cleanedUpContent, false);
          //logic for wrapping plain text inside paragraph tags

          if (Array.isArray(cleanedUpJson.content)) {
            cleanedUpJson.content.forEach((ele) => {
              if (ele.type === "body" && Array.isArray(ele.content)) {
                ele.content.forEach((bodyEle, indx) => {
                  if (
                    typeof bodyEle === "string" &&
                    bodyEle.trim() !== "\n" &&
                    bodyEle.trim() !== "\n\n" &&
                    bodyEle.trim() !== ""
                  ) {
                    ele.content[indx] = { type: "p", content: [bodyEle] };
                  }
                });
              }
            });
          }

          const modifiedDitaCode = codeRestructure(
            await JSONToHTML(characterToEntity(cleanedUpJson))
          );

          let topicWise = fileSeparator(modifiedDitaCode);

          topicWise = topicWise.filter(
            (ele) => !(typeof ele === "object" && ele.level === undefined)
          );

          let newPath = filePath.path
            .replace(/\\/g, "/")
            .split("/")
            .slice(1)
            .join("/");

          fileInfo.nestObj = [];

          await processTopicWise(
            topicWise,
            newPath,
            outputDirName,
            fileInfo,
            filePath
          );
        } catch (error) {
          console.error("Error processing topics:", error);
        }
      } else {
      }
    }
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}

function codeRestructure(xmlString) {
  let newXmlString = moveTgroupClosingTagBeforeTable(xmlString);
  let addedTopicTag = addTopicTag(newXmlString);
  let SortedTopicsTags = SortTopicsTags(addedTopicTag);

  // let colMerge = colMergeFixer(SortedTopicsTags);

  let colFixed = colFixerWithoutHeadTag(SortedTopicsTags);
  return colFixed;
}

module.exports = checkFilesInFolder;
