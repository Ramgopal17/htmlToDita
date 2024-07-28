function fileSeparator(xmlString) {
  const topics = [];
  let index = xmlString.lastIndexOf("<topic id=");

  while (index !== -1) {
    const endTopicIndex =
      xmlString.indexOf("</topic>", index) + "</topic>".length;
    let topicContent = xmlString.substring(index, endTopicIndex);

    topics.unshift({
      content: topicContent,
      title: extractTitle(topicContent).title,
      level: extractTitle(topicContent).outputclass.split("h")[1],
    });

    xmlString =
      xmlString.substring(0, index) + xmlString.substring(endTopicIndex);
    index = xmlString.lastIndexOf("<topic id=");
  }

  return topics;
}

function extractTitle(topic) {
  const titleStartIndex = topic.indexOf("<title");
  const titleEndIndex = topic.indexOf("</title>", titleStartIndex);
  const titleContent = topic.substring(
    titleStartIndex,
    titleEndIndex + "</title>".length
  );

  // Extracting the title text
  const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, "");

  // Extracting the outputclass attribute value
  const outputclassMatch = titleContent.match(/outputclass="([^"]+)"/);
  const outputclass = outputclassMatch ? outputclassMatch[1] : "";

  return { title: titleText.trim(), outputclass: outputclass };
}

module.exports = fileSeparator;
