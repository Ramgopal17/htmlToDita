const { DOMParser, XMLSerializer } = require("xmldom");

function dtdConcept(content) {
  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const body = xmlDoc.getElementsByTagName("body")[0];

    if (!body) {
      resolve({ content, boolValue: false });
      return;
    }

    const childElements = [];
    let node = body.firstChild;
    let count = 0;
    while (node && count < 1) {
      if (node.nodeType === 1) {
        childElements.push(node.nodeName);
        count++;
      }
      node = node.nextSibling;
    }

    if (childElements.length >= 1) {
      if (childElements.every((tag) => tag === "p")) {
        const serializer = new XMLSerializer();
        let modifiedContent = serializer
          .serializeToString(xmlDoc)
          .replace(/<topic/g, "<concept")
          .replace(/<\/topic>/g, "</concept>")
          .replace(/<body>/, "<conbody>")
          .replace(/<\/body>/, "</conbody>");

        resolve({ content: modifiedContent, boolValue: true });
        return;
      }
    }

    resolve({ content, boolValue: false });
  });
}

module.exports = dtdConcept;
