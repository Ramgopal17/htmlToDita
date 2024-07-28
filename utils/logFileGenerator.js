const fs = require("fs");

function logFileGenerator(logData, outputDirName) {
  const logContent = `***************************************************
Handled Tags:
***************************************************
${Object.keys(logData.handledTags).join("\n")}



***************************************************
Missing Tags:
***************************************************
${Object.keys(logData.missingTags).join("\n")}
  


***************************************************
Skipped Files:
***************************************************
${logData.skippedFiles.join("\n")}
`;

  fs.writeFileSync(`${outputDirName}/log.txt`, logContent);
}

module.exports = logFileGenerator;
