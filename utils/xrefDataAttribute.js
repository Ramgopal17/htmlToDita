const { DOMParser } = require("xmldom");
const { addTopicData } = require("../state/topicData");

function xrefDataAttribute(xmlContent, fileName, outputFilePath) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, "text/xml");

  let topicElement = doc.getElementsByTagName("topic")[0];
  let title = doc.getElementsByTagName("title")[0];

  let titleType = title.getAttribute("outputclass");

  if (topicElement === undefined) {
    topicElement = doc.getElementsByTagName("concept")[0];
  }

  if (topicElement === undefined) {
    topicElement = doc.getElementsByTagName("reference")[0];
  }

  if (topicElement === undefined) {
    topicElement = doc.getElementsByTagName("task")[0];
  }

  const topicId = topicElement.getAttribute("id");

  addTopicData({
    topicId,
    fileName,
    outputFilePath,
    titleType,
  });
}

module.exports = xrefDataAttribute;
