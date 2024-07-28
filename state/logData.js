const logData = {
  missingTags: {},
  handledTags: {},
  skippedFiles: [],
};

function getLogData() {
  return logData;
}

function addMissingTags(type, isMissing) {
  logData.missingTags[type] = isMissing;
}

function addHandledTags(type, isMissing) {
  logData.handledTags[type] = isMissing;
}

function addSkippedFiles(filePath) {
  logData.skippedFiles.push(filePath);
}

function resetlogData() {
  logData.missingTags = {};
  logData.handledTags = {};
  logData.skippedFiles = [];
}

module.exports = {
  addMissingTags,
  addHandledTags,
  getLogData,
  addSkippedFiles,
  resetlogData,
};
