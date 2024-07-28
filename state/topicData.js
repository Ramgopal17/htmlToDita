let topicData = [];

function getTopicRef() {
  return topicData;
}

function addTopicData(newData) {
  topicData.push(newData);
}

function resetTopicData() {
  topicData = [];
}

module.exports = { getTopicRef, addTopicData, resetTopicData };
