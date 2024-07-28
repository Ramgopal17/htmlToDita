const { replaceNbspWithSpace } = require("./helper");
const replaceSpecialCharactersWithEntities = require("./replaceSpecialCharactersWithEntities");

// recursive function for converting special character to html entity in json content
function characterToEntity(json) {
  if (json.attributes) {
    for (const key in json.attributes) {
      json.attributes[key] = replaceSpecialCharactersWithEntities(
        json.attributes[key]
      );
    }
  }
  if (typeof json === "string") {
    json = replaceNbspWithSpace(json);
    return replaceSpecialCharactersWithEntities(json);
  }
  if (Array.isArray(json.content)) {
    json.content = json.content.map(characterToEntity);
  }
  return json;
}

module.exports = characterToEntity;
