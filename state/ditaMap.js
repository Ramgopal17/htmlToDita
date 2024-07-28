let globalState = {
  data: [],
};

function getData() {
  return globalState.data;
}

function addData(newData) {
  // Check if the last element in the data array is the same as newData
  if (
    globalState.data.length === 0 ||
    globalState.data[globalState.data.length - 1] !== newData
  ) {
    globalState.data.push(newData);
  }
}

function resetDitaMapData() {
  globalState.data = [];
}

module.exports = {
  getData,
  addData,
  resetDitaMapData,
};
