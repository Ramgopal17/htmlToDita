let globalState = {
  dataRootDitaMap: [],
};

function getDataRoot() {
  return globalState.dataRootDitaMap;
}

function updateDataRoot(newData) {
  globalState.dataRootDitaMap.push(newData);
}

function resetDataRoot() {
  globalState.dataRootDitaMap = [];
}
module.exports = { getDataRoot, updateDataRoot, resetDataRoot };
