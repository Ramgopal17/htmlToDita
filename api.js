const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const shell = require("shelljs");
const app = express();

require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 8449;
const BASE = process.env.BASE;
const AdmZip = require("adm-zip");
const archiver = require("archiver");

const fileValidator = require("./utils/fileValidator");
const isValidDirectory = require("./utils/ValidDirectory");
const checkFilesInFolder = require("./utils/mainMethod");
const { getData, resetDitaMapData } = require("./state/ditaMap");
const { resetlogData, getLogData } = require("./state/logData");

const xmlFormat = require("xml-formatter");
const { copyImages, createXMLStructure } = require("./utils/helper");
const {
  setInputFileName,
  getInputFileName,
  resetInputFileName,
} = require("./state/allVeriables");
const xRefPathFixer = require("./utils/xRefPathFixer");
const { resetTopicData } = require("./state/topicData");
const preFlightChecker = require("./utils/preFlightChecker");

app.use(cors());

app.use(fileUpload());

let inputFolderDir = "input";
const outputFolderPath = "./output";

// API route to handle file upload and processing
app.post("/api/upload", async (req, res) => {
  try {
    const inputDir = path.join(__dirname, inputFolderDir);
    const outputDir = path.join(__dirname, outputFolderPath);

    // Recreate 'input' and 'output' directories
    shell.rm("-rf", inputDir);
    shell.mkdir("-p", inputDir);

    shell.rm("-rf", outputDir);
    shell.mkdir("-p", outputDir);

    if (!req.files || !req.files.zipFile) {
      return res
        .status(400)
        .json({ message: "No zip file provided", status: 400 });
    }

    const zipFile = req.files.zipFile;
    const inputFilePath = path.join(inputDir, zipFile.name);

    // Move the uploaded zip file to the input directory
    await zipFile.mv(inputFilePath);

    // Extract the zip file
    const zip = new AdmZip(inputFilePath);
    zip.extractAllTo(inputDir, true);

    // Validate files asynchronously
    fileValidator(inputDir)
      .then((counts) => {
        if (counts.htmlCounter === 0) {
          // If no html files found, delete the input directory
          shell.rm("-rf", inputDir);
          return res.status(400).json({
            message: "No html files found in zip file.",
            status: 400,
          });
        } else {
          // If html files found, send success response
          return res.status(200).json({
            message: "Zip file uploaded and extracted successfully.",
            status: 200,
          });
        }
      })
      .catch((error) => {
        console.error("Error validating files:", error);
        return res.status(500).json({
          message: "Internal server error during file validation",
          status: 500,
        });
      })
      .finally(() => {
        // Remove the zip file after extraction and validation
        if (fs.existsSync(inputFilePath)) {
          fs.unlinkSync(inputFilePath);
        }
      });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

app.get("/api/htmltodita", async (req, res) => {
  try {
    // Process the files in the input directory
    const isValid = await isValidDirectory(inputFolderDir);

    if (!isValid) {
      return res
        .status(404)
        .json({ message: "Please upload zip file first!", status: 404 });
    } else if (isValid) {
      // await checkFilesInFolder(inputFolderDir);

      // reset ditaMapData before processing files
      resetDitaMapData();
      resetTopicData();

      checkFilesInFolder(inputFolderDir)
        .then(() => {
          let ignoredFileList = getLogData();

          copyImages(ignoredFileList.skippedFiles, outputFolderPath);

          let nestedFiles = {};

          let getDataArr = getData();

          // let uniqueData1 = getDataArr.filter((item, index, self) => {
          //   return (
          //     index ===
          //     self.findIndex(
          //       (obj) =>
          //         obj.file === item.file &&
          //         JSON.stringify(obj.nestObj) === JSON.stringify(item.nestObj)
          //     )
          //   );
          // });

          // function sortByLevel(data) {
          //   data.forEach((fileObj) => {
          //     fileObj.nestObj.sort((a, b) => a.level - b.level);
          //   });
          //   return data;
          // }

          // getDataArr = sortByLevel(getDataArr);

          // function reverseNestObj(jsonData) {
          //   return jsonData.map((item) => {
          //     return {
          //       ...item,
          //       nestObj: item.nestObj.reverse(),
          //     };
          //   });
          // }

          // Reversing the nestObj array in each object
          // const reversedData = reverseNestObj(getDataArr);

          // console.log(JSON.stringify(reversedData, null, 2));

          try {
            getDataArr.forEach((obj) => {
              obj.nestObj.forEach((ff) => {
                const level = parseInt(ff.level, 10);
                let parent = nestedFiles;

                // Traverse down to the correct parent level
                for (let i = 1; i < level; i++) {
                  if (!parent.child || parent.child.length === 0) {
                    // If no children exist at the expected parent level, break out and use the last found parent
                    break;
                  }
                  parent = parent.child[parent.child.length - 1];
                }

                // Ensure the parent has a child array
                if (!parent.child) parent.child = [];

                // Add the current nested object to the parent's children
                parent.child.push(ff);
              });
            });
          } catch (error) {
            console.error("Error occurred:", error.message);
          }

          // console.log(JSON.stringify(nestedFiles, null, 2));

          // try {
          //   getDataArr.forEach((obj) => {
          //     obj.nestObj.forEach((ff) => {
          //       const level = parseInt(ff.level);
          //       let parent = nestedFiles;

          //       for (let i = 1; i < level; i++) {
          //         if (!parent.child || parent.child.length === 0) {
          //           console.error(
          //             "Error occurred: Parent has no children.",
          //             parent
          //           );
          //           throw new Error("Parent has no children.");
          //         }
          //         parent = parent.child[parent.child.length - 1];
          //       }

          //       if (!parent.child) parent.child = [];
          //       parent.child.push(ff);
          //     });
          //   });
          // } catch (error) {
          //   console.error("Error occurred:", error.message);
          // }

          // console.log(JSON.stringify(nestedFiles, null, 2));

          // Check if the output folder exists
          const folderExists = fs.existsSync(outputFolderPath);
          if (!folderExists) {
            return res
              .status(404)
              .json({ message: "Output folder not found", status: 404 });
          }

          // Create a unique identifier for the download link
          const downloadId = Math.random().toString(36).substring(7);
          // const downloadLink = `http://localhost:${PORT}/api/download/${downloadId}`;
          const downloadLink = `${BASE}/api/download/${downloadId}`;

          const downloadPath = path.join(__dirname, "downloads", downloadId);
          fs.mkdirSync(downloadPath, { recursive: true });

          let inputFolderName = "output.zip";

          if (getDataArr.length !== 0) {
            inputFolderName = getDataArr[0].file.split("/")[1] + "_output.zip";
          }

          setInputFileName(inputFolderName);

          const outputZipPath = path.join(downloadPath, inputFolderName);

          // Create a zip file
          const output = fs.createWriteStream(outputZipPath);
          const archive = archiver("zip", {
            zlib: { level: 9 }, // Set compression level
          });

          // Pipe the archive data to the output file
          archive.pipe(output);

          // Add the output folder to the archive
          archive.directory(outputFolderPath, false);

          // Finalize the archive
          archive.finalize();

          const xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
<map>\n${createXMLStructure(nestedFiles)}</map>`;

          fs.writeFileSync(
            `${outputFolderPath}/index.ditamap`,
            xmlFormat(xmlString, {
              indentation: "  ",
              filter: (node) => node.type !== "Comment",
              collapseContent: true,
              lineSeparator: "\n",
            })
          );

          xRefPathFixer(outputFolderPath)
            .then(() => {
              // console.log("All files processed successfully.");

              // Send response indicating successful processing and the download link
              // Cleanup the uploaded zip file
              cleanupUploadedZip(inputFolderDir, downloadId);

              res.status(200).json({
                message: "Files converted successfully.",
                downloadLink,
                status: 200,
              });

              resetTopicData();
            })
            .catch((error) => {
              console.error("Error processing files:", error);
            });
        })
        .then(() => {
          resetDitaMapData();
          resetlogData();
        })
        .catch((error) => {
          console.error("Error processing files:", error);
        });
    }
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

app.get("/api/download/:downloadId", (req, res) => {
  let originalFileName = getInputFileName();

  const downloadId = req.params.downloadId;
  const downloadPath = path.join(
    __dirname,
    "downloads",
    downloadId,
    originalFileName
  );

  // Check if the file exists
  if (fs.existsSync(downloadPath)) {
    // Set response headers for downloading the zip file
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalFileName}"`
    );

    // Pipe the zip file to the response
    const fileStream = fs.createReadStream(downloadPath);
    fileStream.pipe(res);

    resetInputFileName();
  } else {
    res.status(404).json({ message: "File not found", status: 404 });
  }
});

app.post("/api/checkPreflight", async (req, res) => {
  const filePath = path.join(__dirname, inputFolderDir);

  try {
    const files = await fs.promises.readdir(filePath);

    if (files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files found in the folder", status: 400 });
    }

    let allResults = [];
    let invalidFiles = [];

    try {
      const results = await preFlightChecker(filePath);

      allResults = allResults.concat(results);
    } catch (err) {
      return res.status(500).json({ message: err.message, status: 500 });
    }

    invalidFiles = allResults
      .filter((result) => !result.title)
      .map((result) => result.filePath);

    if (invalidFiles.length > 0) {
      console.log("Some files do not contain a title.");
      return res.status(400).json({
        message: "The following files do not contain a title.",
        status: 400,
        invalidFiles,
      });
    } else {
      console.log("All files contain a title.");
      return res.status(200).json({ message: "ok", status: 200 });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error reading folder", status: 500 });
  } finally {
    allResults = [];
    invalidFiles = [];
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function cleanupUploadedZip(inputFolderDir, downloadId) {
  let downloadDir = path.join(__dirname, "downloads");

  try {
    // Remove the directory recursively
    shell.rm("-rf", inputFolderDir);

    const files = fs.readdirSync(downloadDir);

    files.forEach((file) => {
      const filePath = path.join(downloadDir, file);

      if (fs.lstatSync(filePath).isDirectory() && file !== downloadId) {
        shell.rm("-rf", filePath);
      }
    });
  } catch (error) {
    console.error("Error cleaning up uploaded zip file:", error);
  }
}
