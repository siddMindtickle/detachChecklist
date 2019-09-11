import { get, put, del } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";

import { START, SIZE } from "../config/constants";
import { convertArrayToObject } from "@utils";
const TagsService = {};
const parseAppliedTags = ({ tagsDetails = {}, tags = [] }) => {
  const appliedTags = tags.reduce((result, tag) => {
    const tagId = tag.tag_id;
    if (tagsDetails[tagId]) result[tagId] = { name: tagsDetails[tagId].name };
    return result;
  }, {});
  return appliedTags;
};

const parseCategories = ({ categories }) => {
  const parsedCategories = {};
  for (const [categoryId, category] of Object.entries(categories)) {
    parsedCategories[categoryId] = parsedCategories[categoryId] || {
      name: category.name,
      id: categoryId,
      description: category.description
    };
  }
  return parsedCategories;
};

const parseTags = ({ tags }) => {
  const parsedTags = {};
  tags.forEach(tag => {
    parsedTags[tag.id] = {};
    parsedTags[tag.id].name = tag.name;
    parsedTags[tag.id].id = tag.id;
    parsedTags[tag.id].categoryId = tag.category;
  });
  return parsedTags;
};

const parseSearchResponse = ({ categories, tags }) => {
  let totalTags = 0;
  tags = Object.values(tags) || [];
  tags = tags.reduce((result, { hits = [], totalHits = 0 } = {}) => {
    totalTags += totalHits;
    return [...result, ...hits];
  }, []);
  const parsedTags = parseTags({ tags });
  const parsedCategories = parseCategories({ categories });
  return {
    tags: parsedTags,
    categories: parsedCategories,
    totalTags
  };
};

const parseSuggestedTags = ({ tagList }) => {
  const categoriesMap = {};
  const tagsMap = {};
  tagList.forEach(({ categoryDetails, tagDetals }) => {
    tagsMap[tagDetals.tagId] = {
      name: tagDetals.tagName,
      id: tagDetals.tagId,
      categoryId: categoryDetails.tagId
    };
    categoriesMap[categoryDetails.tagId] = {
      name: categoryDetails.tagName,
      id: categoryDetails.tagId,
      description: categoryDetails.tagDescription
    };
  });
  return {
    categoriesMap,
    tagsMap
  };
};

const processCreateTagData = ({ name, categoryId }) => {
  return {
    tagName: name,
    categoryId: categoryId
  };
};

const processApplyTagsData = (tags = []) => {
  tags = tags.map(id => {
    return { tag_id: id };
  });
  return {
    object_tags: tags
  };
};

TagsService.getAppliedTags = async ({ moduleId, companyId, seriesId }) => {
  const {
    tags: tagsDetails,
    object_tags: { hits: tags }
  } = await get(
    ApiUrls.getAppliedTags({
      moduleId,
      companyId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return parseAppliedTags({ tagsDetails, tags });
};

TagsService.getSuggestedTags = async ({ companyId }) => {
  const { hits: tagList } = await get(ApiUrls.getSuggestedTags({ companyId }));
  return parseSuggestedTags({ tagList });
};

TagsService.getTagsBySearch = async ({
  moduleId,
  companyId,
  seriesId,
  data: { start = START, size = SIZE, query } = {}
}) => {
  const urlObj = ApiUrls.getTags({
    moduleId,
    companyId,
    query: {
      forSeries: seriesId,
      include_category_info: true,
      start,
      size,
      query
    }
  });
  const { categories = {}, tags = {} } = await get(urlObj);
  const { categories: parsedCategories, tags: parsedTags, totalTags } = parseSearchResponse({
    categories,
    tags
  });
  return {
    categories: parsedCategories,
    tags: parsedTags,
    hasMore: size < totalTags
  };
};

TagsService.removeTag = async ({ moduleId, companyId, seriesId, data = {} }) => {
  const urlObj = ApiUrls.removeTag({
    moduleId,
    companyId,
    query: {
      forSeries: seriesId,
      tag_ids: data.processIds.join(",")
    }
  });
  const { tags = [] } = await del(urlObj);
  return convertArrayToObject(tags, false);
};

TagsService.createTag = async ({ companyId, seriesId, data = {} }) => {
  const urlObj = ApiUrls.createTag({
    categoryId: data.categoryId,
    companyId,
    query: {
      forSeries: seriesId
    }
  });
  const response = await put(urlObj, { body: processCreateTagData(data) });
  return parseTags({ tags: [response] });
};

TagsService.applyTags = async ({ moduleId, companyId, seriesId, data = {} }) => {
  const urlObj = ApiUrls.applyTags({
    moduleId,
    companyId,
    query: {
      forSeries: seriesId
    }
  });
  const { tags = [] } = await put(urlObj, {
    body: processApplyTagsData(data.processIds)
  });
  return convertArrayToObject(tags);
};

export default TagsService;
