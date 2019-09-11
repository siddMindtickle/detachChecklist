export const parseTagsByCatgegory = ({ tags, categoriesMap, tagsMap, selectedTags }) => {
  const parsedData = {};
  Object.keys(tags).forEach(tagId => {
    const tag = tagsMap[tagId] || {};
    const category = categoriesMap[tag.categoryId] || {};
    tag.selected = selectedTags[tag.id];
    parsedData[tag.categoryId] = parsedData[tag.categoryId] || { tags: [] };
    parsedData[tag.categoryId].name = category.name;
    parsedData[tag.categoryId].description = category.description;
    parsedData[tag.categoryId].tags.push(tag);
  });
  return parsedData;
};

export const parseSuggestedTags = ({ suggestedTags, tagsMap, selectedTags }) => {
  return suggestedTags.map(tagId => {
    return {
      ...tagsMap[tagId],
      selected: selectedTags[tagId]
    };
  });
};
