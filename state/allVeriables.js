let inputFileName = "";

function setInputFileName(fileName) {
  inputFileName = fileName;
}

function getInputFileName() {
  return inputFileName;
}

function resetInputFileName() {
  inputFileName = "";
}

module.exports = { setInputFileName, getInputFileName, resetInputFileName };
