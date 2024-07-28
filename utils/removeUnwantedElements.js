const { schema } = require("../schema");
const { addMissingTags, addHandledTags } = require("../state/logData");
const generateRandomId = require("./generateRandomId");
const validateURL = require("./validateURL");

function removeUnwantedElements(
  json /*any tag details as a dom json*/,
  parentDetails /*details of immediate parent of any tag*/,
  parentDivClass
) {
  if (typeof json === "object" && json !== null) {
    const type = json.type;
    let currentDivClass, isTagHandled;
    // replace or remove switch case based on schema and custom condition as per project requirements

    switch (type) {
      case "link":
        json.type = "";
        delete json.attributes;
        isTagHandled = true;
        break;

      case "style":
        json.type = "";
        delete json.content;
        break;

      case "head":
        json.type = "";
        json.content = [];

        break;
      case "ol":
        json.attributes = {};
        break;
      case "body":
        json.attributes = {};
        break;
      case "p":
        isTagHandled = true;

        if (parentDetails.type === "p") {
          json.attributes = parentDetails.attributes
            ? { ...parentDetails.attributes }
            : {};
          json.attributes.class =
            (json.attributes.class || "") + ` ${parentDivClass}`;
          json.attributes.class = json.attributes.class.trim();
          parentDetails.type = "";
          delete parentDetails.attributes;
        }
        if (parentDivClass) {
          // fs.writeFileSync("bug.text",""+bugCount++,"utf-8")
          json.attributes = {};
          json.attributes.class =
            (json.attributes?.class || "") + ` ${parentDivClass}`;
          json.attributes.class = json.attributes.class.trim();
        }

        // if (json?.content[0].type === "p" && json.content[0].type === "p") {
        //   console.log(json);
        // }

        // console.log(JSON.stringify(json, null, 2));

        let hasKeyattrP = "attributes" in json;

        if (hasKeyattrP) {
          json.attributes = {};
        }

        // Check if json.content is undefined
        if (json.content === undefined) {
          delete json.type;
        }

        break;
      case "div":
        isTagHandled = true;
        currentDivClass = json.attributes?.class
          ? json.attributes?.class
          : parentDivClass;
        if (
          json.attributes?.id === "footer" ||
          json.attributes?.id === "searchBoxModal" ||
          json.attributes?.id === "nextPreviusButtons" ||
          json.attributes?.id === "feedbackCommentBox" ||
          json.attributes?.class === "bs-sidebar"
        ) {
          json.type = "";
          delete json.content;
          delete json.attributes;
          break;
        } else if (json.attributes?.id === "open-api-spec") {
          json.type = "pre";

          delete json.attributes?.class;
          delete json.attributes?.id;
          break;
        } else if (json.attributes?.class === "greybox") {
          json.type = "p";
          delete json.attributes?.class;
          delete json.attributes?.align;
          break;
        } else if (json.attributes?.class === "page-metadata") {
          delete json.attributes?.class;
          json.type = "p";
          break;
        }

        json.type = "";
        delete json.attributes;
        break;
      case "html":
        isTagHandled = true;
        json.type = "topic";

        json.attributes = {};
        json.attributes.id = "id_" + generateRandomId(6);

        break;
      case "h1":
        isTagHandled = true;

        json.type = "title";
        let hasKeyattrh1 = "attributes" in json;

        if (hasKeyattrh1) {
          delete json.attributes?.class;
          delete json.attributes?.id;
          delete json.attributes?.style;
        }

        if (!hasKeyattrh1) {
          json["attributes"] = {};
        }

        let attrtitleh1 = json.attributes;
        attrtitleh1["outputclass"] = "h1";

        if (json.attributes === undefined) {
          json["attributes"] = {
            class: "- topic/title ",
          };
        } else {
          json.attributes["class"] = "- topic/title ";
        }

        break;
      case "h2":
        isTagHandled = true;
        json.type = "title";
        let hasKeyattrh2 = "attributes" in json;

        if (hasKeyattrh2) {
          delete json.attributes?.class;
          delete json.attributes?.id;
          delete json.attributes?.style;
        }

        if (!hasKeyattrh2) {
          json["attributes"] = {};
        }

        let attrtitleh2 = json.attributes;
        attrtitleh2["outputclass"] = "h2";

        if (json.attributes === undefined) {
          json["attributes"] = {
            class: "- topic/title ",
          };
        } else {
          json.attributes["class"] = "- topic/title ";
        }
        break;
      case "h3":
        isTagHandled = true;
        json.type = "title";
        let hasKeyattrh3 = "attributes" in json;

        if (hasKeyattrh3) {
          delete json.attributes?.class;
          delete json.attributes?.id;
          delete json.attributes?.style;
        }

        if (!hasKeyattrh3) {
          json["attributes"] = {};
        }
        let attrtitleh3 = json.attributes;
        attrtitleh3["outputclass"] = "h3";

        if (json.attributes === undefined) {
          json["attributes"] = {
            class: "- topic/title ",
          };
        } else {
          json.attributes["class"] = "- topic/title ";
        }
        break;
      case "h4":
        isTagHandled = true;
        json.type = "title";
        let hasKeyattrh4 = "attributes" in json;

        if (hasKeyattrh4) {
          delete json.attributes?.class;
          delete json.attributes?.id;
          delete json.attributes?.style;
        }

        if (!hasKeyattrh4) {
          json["attributes"] = {};
        }
        let attrtitleh4 = json.attributes;
        attrtitleh4["outputclass"] = "h4";

        if (json.attributes === undefined) {
          json["attributes"] = {
            class: "- topic/title ",
          };
        } else {
          json.attributes["class"] = "- topic/title ";
        }
        break;
      case "h5":
        isTagHandled = true;
        json.type = "title";
        let hasKeyattrh5 = "attributes" in json;

        if (hasKeyattrh5) {
          delete json.attributes?.class;
          delete json.attributes?.id;
          delete json.attributes?.style;
        }

        if (!hasKeyattrh5) {
          json["attributes"] = {};
        }
        let attrtitleh5 = json.attributes;
        attrtitleh5["outputclass"] = "h5";

        if (json.attributes === undefined) {
          json["attributes"] = {
            class: "- topic/title ",
          };
        } else {
          json.attributes["class"] = "- topic/title ";
        }
        break;
      case "h6":
        isTagHandled = true;
        json.type = "title";
        let hasKeyattrh6 = "attributes" in json;

        if (hasKeyattrh6) {
          delete json.attributes?.class;
          delete json.attributes?.id;
          delete json.attributes?.style;
        }

        if (!hasKeyattrh6) {
          json["attributes"] = {};
        }
        let attrtitleh6 = json.attributes;
        attrtitleh6["outputclass"] = "h6";

        if (json.attributes === undefined) {
          json["attributes"] = {
            class: "- topic/title ",
          };
        } else {
          json.attributes["class"] = "- topic/title ";
        }
        break;

      case "nav":
        if (
          json.attributes?.role === "navigation" &&
          json.attributes?.class === "related-links"
        ) {
          json.type = "";
          delete json.content;
          delete json.attributes;
          break;
        }
        break;
      case "a":
        isTagHandled = true;

        if (json.attributes?.href === undefined && json.content === undefined) {
          break;
        }

        json.type = "xref";
        let attra = json.attributes;

        // if (json.attributes.href !== undefined){}
        if (attra["data-linktype"]) attra["scope"] = attra["data-linktype"];
        else if (validateURL(json.attributes.href)) {
          attra["scope"] = "external";
          attra["format"] = "html";
        }

        delete attra["data-linktype"];
        delete attra["target"];
        delete attra["rel"];
        delete json.attributes?.id;
        delete json.attributes?.class;
        delete json.attributes?.name;
        delete json.attributes?.style;

        if (json.attributes) {
          keepAttributes(["scope", "format", "href"], json.attributes);
        }

        break;

      case "section":
        json?.content?.map((secEle) => {
          if (typeof secEle === "object" && secEle.type === "h2") {
            secEle.type = "p";
          }
        });

        isTagHandled = true;
        json.type = "p";
        json.attributes = {};

        break;

      case "img":
        isTagHandled = true;
        json.type = "image";
        let attr = json.attributes;
        attr["href"] = attr["src"];

        for (let key in attr) {
          if (key !== "href") {
            delete attr[key];
          }
        }

        break;

      case "span":
        isTagHandled = true;

        if (json.attributes?.class === "ph uicontrol") {
          json.type = "b";

          if (json.content.length > 1) {
            json.content.map((spanEle) => {
              if (typeof spanEle === "object") {
                json.type = "ph";
              }
            });
          }
          delete json.attributes;
        }

        if (json?.content) {
          if (json.content[0].type === "img") {
            json.type = "";
          }
        }

        break;

      case "pre":
        isTagHandled = true;

        if (json.type === "pre" && Array.isArray(json.content)) {
          json.content = json.content.map((line) => {
            if (typeof line === "string") {
              return line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            } else {
              return line.toString();
            }
          });
        }

        delete json?.attributes;
        break;

      case "strong":
        isTagHandled = true;

        json.type = "b";

        if (json.content[0].type === "span") {
          if (json.content[0]?.content?.length > 0) {
            json.content[0].content.map((spanEle2) => {
              if (typeof spanEle2 === "object" && spanEle2.type === "img") {
                json.type = "p";
              }
            });
          }
        }

        delete json?.attributes;
        break;

      case "b":
        isTagHandled = true;

        json.type = "p";

        delete json?.attributes;
        break;

      case "em":
        isTagHandled = true;
        json.type = "i";
        if (
          json.content[0].type === "span" &&
          json.content[0].content[0].type === "img"
        ) {
          json.type = "";
        }

        delete json?.attributes;
        // delete json?.attributes?.id;
        // delete json?.attributes?.class;

        break;

      case "ul":
        delete json.attributes?.id;
        delete json.attributes?.class;
        delete json.attributes?.style;

        break;

      case "li":
        delete json.attributes?.id;
        delete json.attributes?.class;
        delete json.attributes?.style;
        delete json.attributes?.["aria-current"];

        json?.content?.map((liEle) => {
          if (typeof liEle === "object") {
            if (
              liEle.type === "h1" ||
              liEle.type === "h2" ||
              liEle.type === "h3" ||
              liEle.type === "h4" ||
              liEle.type === "h5" ||
              liEle.type === "h6"
            ) {
              liEle.type = "p";
            }
          }
        });

        // json.content.map((ele) => {
        //   if (ele.type !== undefined) {
        //     if (ele.attributes?.class !== undefined) {
        //       console.log(ele.);
        //     }
        //   }
        // });
        break;
      case "footer":
        json.type = "";
        delete json.content;
        delete json.attributes;
        break;

      case "blockquote":
        isTagHandled = true;
        json.type = "lq";
        break;
      case "table":
        let tableAttr = json.attributes;

        if (tableAttr) {
          json.attributes = {};
        }
        break;
      case "thead":
        RemoveAttributes(json.attributes);
        break;
      case "tbody":
        RemoveAttributes(json.attributes);
        break;
      case "colgroup":
        isTagHandled = true;
        json.type = "tgroup";

        break;
      case "tgroup":
        if (json.attributes) {
          RemoveAttributes(json.attributes);
        }
        let colsCount = json.content.length;
        json.attributes["cols"] = colsCount;

        break;
      case "col":
        isTagHandled = true;
        json.type = "colspec";
        break;
      case "tr":
        isTagHandled = true;
        json.type = "row";

        RemoveAttributes(json.attributes);

        break;
      case "td":
        isTagHandled = true;

        if (json.attributes !== undefined) {
          const rowspanValue = json.attributes?.rowspan;

          if (rowspanValue !== undefined) {
            json.attributes.morerows =
              rowspanValue > 1 ? (rowspanValue - 1).toString() : rowspanValue;
          }
        }

        if (json.attributes?.namest === json.attributes?.nameend) {
          delete json.attributes?.namest;
          delete json.attributes?.nameend;
        }

        json.content.map((tdEle) => {
          if (
            tdEle.type === "div" &&
            tdEle.attributes?.class === "table-wrap"
          ) {
            tdEle.type = "p";
          }
        });

        json.content?.map((tdEle2) => {
          if (
            typeof tdEle2 === "object" &&
            tdEle2.type === "div" &&
            tdEle2.attributes?.class === "content-wrapper"
          ) {
            tdEle2.content?.map((tdEle3) => {
              if (
                typeof tdEle3 === "object" &&
                tdEle3.type === "div" &&
                tdEle3.attributes?.class === "table-wrap"
              ) {
                tdEle3.type = "p";
              }
            });
          }
        });

        if (json.attributes) {
          keepAttributes(["namest", "nameend"], json.attributes);
        }

        json.type = "entry";

        break;
      case "th":
        isTagHandled = true;

        if (json.attributes !== undefined) {
          const rowspanValueTh = json.attributes?.rowspan;

          if (rowspanValueTh !== undefined) {
            json.attributes.morerows =
              rowspanValueTh > 1
                ? (rowspanValueTh - 1).toString()
                : rowspanValueTh;
          }
        }

        if (json.attributes?.namest === json.attributes?.nameend) {
          delete json.attributes?.namest;
          delete json.attributes?.nameend;
        }

        // let colspanCount = "colspan" in json.attributes;
        // if (colspanCount) {
        //   console.log(json);
        // }

        if (json.attributes) {
          keepAttributes(["namest", "nameend"], json.attributes);
          // RemoveAttributes(json.attributes);
        }

        json.type = "entry";
        break;
      default:
        break;
    }
    if (!schema[type] && !isTagHandled) {
      //if tag is not in schema or not handled in switch case and neither it is mapped in the database
      addMissingTags(type, true);
    } else {
      addHandledTags(type, true);
    }
    if (schema[json.type]) {
      if (Array.isArray(json.content)) {
        json.content = json.content.map((ele) =>
          removeUnwantedElements(
            ele,
            json.type ? json : parentDetails,
            currentDivClass
          )
        );
      } else if (Array.isArray(json.content)) {
        json.type = "";
        delete json.attributes;
        json.content.map((ele) =>
          removeUnwantedElements(
            ele,
            json.type ? json : parentDetails,
            currentDivClass
          )
        );
      }
      return json;
    } else if (Array.isArray(json.content)) {
      json.type = "";
      delete json.attributes;
      json?.content?.map((ele) =>
        removeUnwantedElements(
          ele,
          json.type ? json : parentDetails,
          currentDivClass
        )
      );
    } else if (!json.content) {
      json.type = "";
      delete json.attributes;
      return json;
    }
  }
  return json;
}
module.exports = removeUnwantedElements;

function RemoveAttributes(attrs) {
  for (const attr in attrs) {
    delete attrs[attr];
  }
}

function keepAttributes(attributesToKeep, attrs) {
  for (const attr in attrs) {
    if (!attributesToKeep.includes(attr)) {
      delete attrs[attr];
    }
  }
}
