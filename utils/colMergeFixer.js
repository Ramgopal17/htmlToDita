const { DOMParser, XMLSerializer } = require("xmldom");

function colMergeFixer(xmlString) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(xmlString, "text/xml");

  const rows = dom.getElementsByTagName("row");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("entry");

    for (let j = 0; j < cells.length; j++) {
      const entry = cells[j];
      if (entry.getAttribute("colspan")) {
        const colspan = parseInt(entry.getAttribute("colspan"));
        let columnIndex = Array.from(cells).indexOf(entry) + colspan - 1;

        let colspanValue = entry.getAttribute("colspan");

        colspanValue = parseInt(colspanValue) - 1;

        let getEnd = columnIndex + colspanValue;

        entry.setAttribute("namest", `c${columnIndex}`);
        entry.setAttribute("nameend", `c${getEnd}`);
      }
      entry.removeAttribute("colspan");
      entry.removeAttribute("rowspan");
    }
  }

  removeDuplicateNameAttributes(dom);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(dom);
}

function removeDuplicateNameAttributes(dom) {
  const entries = dom.getElementsByTagName("entry");

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const namest = entry.getAttribute("namest");
    const nameend = entry.getAttribute("nameend");

    if (namest && nameend && namest === nameend) {
      entry.removeAttribute("namest");
      entry.removeAttribute("nameend");
    }
  }
}

module.exports = colMergeFixer;
