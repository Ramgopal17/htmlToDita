const { DOMParser, XMLSerializer } = require("xmldom");

module.exports = function FinalTagsCleanUp(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  let topicElement = xmlDoc.getElementsByTagName("topic")[0];
  let bodyType = "body";

  if (!topicElement) {
    bodyType = "conbody";
    topicElement = xmlDoc.getElementsByTagName("concept")[0];
  }

  if (topicElement) {
    const conbodyElements = topicElement.getElementsByTagName(bodyType);

    for (let j = 0; j < conbodyElements.length; j++) {
      const xrefElements = conbodyElements[j].getElementsByTagName("xref");
      const bElements = conbodyElements[j].getElementsByTagName("b");
      const pElements = conbodyElements[j].getElementsByTagName("p");

      for (let k = 0; k < pElements.length; k++) {
        const innerP = pElements[k].getElementsByTagName("p")[0];

        if (innerP) {
          while (innerP.childNodes.length > 0) {
            pElements[k].appendChild(innerP.childNodes[0]);
          }
          pElements[k].removeChild(innerP);
        }
      }

      for (let k = 0; k < xrefElements.length; k++) {
        if (xrefElements[k].parentNode === conbodyElements[j]) {
          const pElement = xmlDoc.createElement("p");

          pElement.appendChild(xrefElements[k].cloneNode(true));

          conbodyElements[j].replaceChild(pElement, xrefElements[k]);
        }
      }

      for (let k = 0; k < bElements.length; k++) {
        if (bElements[k].parentNode === conbodyElements[j]) {
          const pElement = xmlDoc.createElement("p");

          pElement.appendChild(bElements[k].cloneNode(true));

          conbodyElements[j].replaceChild(pElement, bElements[k]);
        }
      }
    }
  }

  let serializedXml = new XMLSerializer().serializeToString(xmlDoc);
  serializedXml = cmdTableFixer(serializedXml);
  serializedXml = tablePTagFixer(serializedXml);

  return serializedXml;
};

function cmdTableFixer(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  let topicElement = xmlDoc.getElementsByTagName("task")[0];

  if (topicElement) {
    const taskbodyEle = topicElement.getElementsByTagName("taskbody")[0];

    const cmdElements = taskbodyEle.getElementsByTagName("cmd");

    for (let k = 0; k < cmdElements.length; k++) {
      const tableElements = cmdElements[k].getElementsByTagName("table");

      for (let l = 0; l < tableElements.length; l++) {
        const table = tableElements[l];
        const infoElement = xmlDoc.createElement("info");
        const pElement = xmlDoc.createElement("p");

        pElement.appendChild(table.cloneNode(true));
        infoElement.appendChild(pElement);

        // Add the infoElement after the cmdElement
        cmdElements[k].parentNode.insertBefore(
          infoElement,
          cmdElements[k].nextSibling
        );

        // Remove the table from cmdElement
        cmdElements[k].removeChild(table);
      }
    }
  }

  const serializedXml = new XMLSerializer().serializeToString(xmlDoc);
  return serializedXml;
}

function tablePTagFixer(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  let tableElements = xmlDoc.getElementsByTagName("table");

  if (tableElements) {
    for (let i = 0; i < tableElements.length; i++) {
      const table = tableElements[i];
      const tgroup = table.getElementsByTagName("tgroup")[0];

      if (tgroup) {
        const pTags = tgroup.getElementsByTagName("p");

        for (let j = pTags.length - 1; j >= 0; j--) {
          const pTag = pTags[j];
          if (pTag.parentNode === tgroup) {
            table.parentNode.insertBefore(pTag, table.nextSibling);
          }
        }

        const childTables = Array.from(tgroup.getElementsByTagName("table"));
        for (let childTable of childTables) {
          if (childTable.parentNode === tgroup) {
            table.parentNode.insertBefore(childTable, table.nextSibling);
          }
        }
      }
    }
  }

  const serializedXml = new XMLSerializer().serializeToString(xmlDoc);

  return serializedXml;
}
