const { DOMParser, XMLSerializer } = require("xmldom");

async function dtdTask(content) {
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
    while (node && count < 3) {
      if (node.nodeType === 1) {
        childElements.push(node.nodeName);
        count++;
      }
      node = node.nextSibling;
    }

    if (childElements.length >= 3) {
      if (
        childElements[0] === "p" &&
        childElements[1] === "p" &&
        childElements[2] === "ol"
      ) {
        const serializer = new XMLSerializer();
        let modifiedContent = serializer
          .serializeToString(xmlDoc)
          .replace("<ul>", "<steps>")
          .replace("</ul>", "</steps>")
          .replace("<ol>", "<steps>")
          .replace("</ol>", "</steps>")
          .replaceAll("<li>", "<step><cmd>")
          .replaceAll("</li>", "</cmd></step>")
          .replace(/<topic/g, "<task")
          .replace(/<\/topic>/g, "</task>")
          .replace(/<body>/, "<taskbody>")
          .replace(/<\/body>/, "</taskbody>");

        modifiedContent = moveFirstPBeforeTaskBody(modifiedContent);
        modifiedContent = wrapPostReq(modifiedContent);
        modifiedContent = replaceStepsWithList(modifiedContent);

        resolve({
          content: modifiedContent,
          boolValue: true,
        });
        return;
      }
    }

    resolve({ content, boolValue: false });
  });
}

function moveFirstPBeforeTaskBody(xmlContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const taskBody = xmlDoc.getElementsByTagName("taskbody")[0];
  const firstP = taskBody.getElementsByTagName("p")[0];
  const secondP = taskBody.getElementsByTagName("p")[1];

  taskBody.removeChild(firstP);

  const taskElement = xmlDoc.getElementsByTagName("task")[0];

  taskElement.insertBefore(firstP, taskBody);
  firstP.tagName = "shortdesc";
  secondP.tagName = "context";

  const serializer = new XMLSerializer();
  const modifiedXmlContent = serializer.serializeToString(xmlDoc);

  return modifiedXmlContent;
}

function wrapPostReq(xmlContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const steps = xmlDoc.getElementsByTagName("steps")[0];
  const postReq = xmlDoc.createElement("postreq");

  let nextNode = steps.nextSibling;
  while (nextNode) {
    const currentNode = nextNode;
    nextNode = currentNode.nextSibling;
    postReq.appendChild(currentNode);
  }

  steps.parentNode.insertBefore(postReq, steps.nextSibling);

  const serializer = new XMLSerializer();
  const modifiedXmlContent = serializer.serializeToString(xmlDoc);

  return modifiedXmlContent;
}

function replaceStepsWithList(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const postreq = xmlDoc.getElementsByTagName("postreq")[0];
  const steps = postreq.getElementsByTagName("step");

  const ulElement = xmlDoc.createElement("ul");

  Array.from(steps).forEach((step) => {
    const liElement = xmlDoc.createElement("li");
    const cmdText = step.getElementsByTagName("cmd")[0].textContent;
    liElement.textContent = cmdText;
    ulElement.appendChild(liElement);
  });

  // Replace all <step> parents with <ul> element
  Array.from(steps).forEach((step) => {
    step.parentNode.replaceChild(ulElement.cloneNode(true), step);
  });

  const serializer = new XMLSerializer();
  const modifiedXmlString = serializer.serializeToString(xmlDoc);

  return modifiedXmlString;
}

function replaceStepsWithList1(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const postreq = xmlDoc.getElementsByTagName("postreq")[0];
  const steps = postreq.getElementsByTagName("step");

  const ulElement = xmlDoc.createElement("ul");

  Array.from(steps).forEach((step) => {
    const liElement = xmlDoc.createElement("li");
    const cmdText = step.getElementsByTagName("cmd")[0].textContent;
    liElement.textContent = cmdText;
    ulElement.appendChild(liElement);
  });

  postreq.replaceChild(ulElement, steps[0].parentNode);

  const serializer = new XMLSerializer();
  const modifiedXmlString = serializer.serializeToString(xmlDoc);

  return modifiedXmlString;
}

module.exports = dtdTask;
