const { DOMParser, XMLSerializer } = require("xmldom");
const { isURL } = require("./helper");

function newfixImagePath(xmlContent, outputFilePath) {
  const parser = new DOMParser();

  const doc = parser.parseFromString(xmlContent, "text/xml");

  // logic for adding xml:lang attribute and removing outputclass attribute
  const tagNames = ["topic", "concept", "reference", "task"];
  let topicElement = null;

  for (const tagName of tagNames) {
    topicElement = doc.getElementsByTagName(tagName)[0];
    if (topicElement) {
      break;
    }
  }
  topicElement.setAttribute("xml:lang", "en-us");
  let title = topicElement.getElementsByTagName("title")[0];
  title.removeAttribute("outputclass");

  // --------------------------------------------------------

  const imageTags = doc.getElementsByTagName("image");
  const xrefTags = doc.getElementsByTagName("xref");

  outputFilePath = outputFilePath.split("/").filter((item) => item !== ".");
  outputFilePath = outputFilePath.slice(1, -1).join("/");

  let pathLenght = outputFilePath.split("/").length;

  for (let i = 0; i < imageTags.length; i++) {
    let dir = "";
    const imageTag = imageTags[i];
    let href = imageTag.getAttribute("href");

    if (!isURL(href)) {
      for (let i = 0; i < pathLenght; i++) {
        dir += "../";
      }

      href = href.split("/").pop();
      href = dir + "images/" + href;

      imageTag.setAttribute("href", href);
    }
  }

  for (let i = 0; i < xrefTags.length; i++) {
    let href = xrefTags[i].getAttribute("href");
    let dir = "";

    if (
      href.split("/")[href.split("/").length - 1].includes(".png") ||
      href.split("/")[href.split("/").length - 1].includes(".jpg") ||
      href.split("/")[href.split("/").length - 1].includes(".jpeg")
    ) {
      for (let i = 0; i < pathLenght; i++) {
        dir += "../";
      }

      href = href.split("/").pop();
      href = dir + "images/" + href;

      xrefTags[i].setAttribute("href", href);
    }
  }

  const serializer = new XMLSerializer();
  const newXmlString = serializer.serializeToString(doc);
  return newXmlString;
}

module.exports = newfixImagePath;
