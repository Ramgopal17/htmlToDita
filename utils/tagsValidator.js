const e = require("cors");
const { DOMParser, XMLSerializer } = require("xmldom");

function tagsValidator(content) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, "text/xml");
  const body = xmlDoc.getElementsByTagName("body")[0];
  const titleElement = xmlDoc.getElementsByTagName("title")[0];

  if (!body) {
    let hasContentAfterTitle = false;

    // Check if there are elements after the title
    let nextElement = titleElement.nextSibling;
    while (nextElement) {
      if (nextElement.nodeType === 1) {
        // Check if it's an element node
        hasContentAfterTitle = true;
        break;
      }
      nextElement = nextElement.nextSibling;
    }

    if (
      (titleElement.getAttribute("outputclass") === "h1" ||
        titleElement.getAttribute("outputclass") === "h2" ||
        titleElement.getAttribute("outputclass") === "h3" ||
        titleElement.getAttribute("outputclass") === "h4" ||
        titleElement.getAttribute("outputclass") === "h5" ||
        titleElement.getAttribute("outputclass") === "h6") &&
      hasContentAfterTitle
    ) {
      const bodyElement = xmlDoc.createElement("body");

      // Move all elements after the title into the body element
      nextElement = titleElement.nextSibling;
      while (nextElement) {
        const temp = nextElement.nextSibling;
        bodyElement.appendChild(nextElement);
        nextElement = temp;
      }

      // Append the body element after the title element
      titleElement.parentNode.insertBefore(
        bodyElement,
        titleElement.nextSibling
      );
    }

    const modifiedXmlContent = new XMLSerializer().serializeToString(xmlDoc);

    return modifiedXmlContent;
  } else {
    return content;
  }
}

module.exports = tagsValidator;
