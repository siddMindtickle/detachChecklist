import { get, post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";
import { API_KEY_MAP } from "../config/constants";

const SettingsService = {};

const parseSettings = (response = {}) => {
  const { certificate, passingScore } = API_KEY_MAP;
  return {
    certificate: !!response[certificate],
    passingScore: { ...response[passingScore] }
  };
};

const preProcessSettings = settings => {
  const processedData = {};
  for (const [key, value] of Object.entries(settings)) {
    const apiKey = API_KEY_MAP[key];
    if (apiKey) processedData[apiKey] = value;
  }
  return processedData;
};

SettingsService.getSettings = async ({ moduleId, seriesId }) => {
  try {
    const response = await get(
      ApiUrls.getSettings({
        moduleId,
        query: { forSeries: seriesId }
      })
    );
    return parseSettings(response);
  } catch (error) {
    throw error;
  }
};

SettingsService.modifySettings = async ({ moduleId, seriesId, data = {} }) => {
  try {
    const response = await post(
      ApiUrls.modifySettings({
        moduleId,
        query: {
          forSeries: seriesId
        }
      }),
      {
        body: preProcessSettings(data)
      }
    );
    return parseSettings(response);
  } catch (error) {
    throw error;
  }
};

export default SettingsService;
