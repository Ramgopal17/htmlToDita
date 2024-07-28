module.exports = function moveTgroupClosingTagBeforeTable(xmlString) {
  let modifiedXml = xmlString;

  function moveTgroupTag(xml, startIndex) {
    let endIndex = xml.indexOf("</tgroup>", startIndex);
    if (endIndex === -1) return xml;

    let closingTag = xml.substring(endIndex, xml.indexOf(">", endIndex) + 1);
    xml =
      xml.substring(0, endIndex) +
      xml.substring(xml.indexOf(">", endIndex) + 1);

    let tableIndex = xml.indexOf("</table>", startIndex);
    if (tableIndex === -1) return xml;

    return (
      xml.substring(0, tableIndex) + closingTag + xml.substring(tableIndex)
    );
  }

  let index = modifiedXml.indexOf("<table>");
  while (index !== -1) {
    modifiedXml = moveTgroupTag(modifiedXml, index);

    let tableIndex = modifiedXml.indexOf("</table>", index);

    let nestedTableIndex = modifiedXml.indexOf("<table>", index + 1);
    while (nestedTableIndex !== -1 && nestedTableIndex < tableIndex) {
      modifiedXml = moveTgroupTag(modifiedXml, nestedTableIndex);

      tableIndex = modifiedXml.indexOf("</table>", index);

      nestedTableIndex = modifiedXml.indexOf("<table>", nestedTableIndex + 1);
    }

    index = modifiedXml.indexOf("<table>", tableIndex + 1);
  }

  return modifiedXml;
};
