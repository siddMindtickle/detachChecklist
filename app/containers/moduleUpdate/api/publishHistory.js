import { get, del, post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";

import { DISPLAY_NAME_SUFFIX } from "../config/constants";

const PublishHistoryService = {};

const parseHistory = ({ data: history, unpublished_changes }) => {
  const parsedHistory = Object.keys(history).map(version => {
    return {
      version,
      time: history[version].publishedTime * 1000,
      prevVersion: history[version].prevVersion
    };
  });
  return {
    hasChanges: !!unpublished_changes,
    versions: parsedHistory.sort((a, b) => b.time - a.time)
  };
};

const parseSummary = ({ content, settings }) => {
  const contentChanges = content.map(changes => {
    return {
      title: `${changes.name} ${DISPLAY_NAME_SUFFIX.CONTENT}`,
      changes: [...changes.children_edit_summary]
    };
  });
  const settingChanges = {
    title: DISPLAY_NAME_SUFFIX.SETTINGS,
    changes: [...settings]
  };

  return [settingChanges, ...contentChanges];
};

PublishHistoryService.getHistory = async ({ moduleId, seriesId }) => {
  const history = await get(
    ApiUrls.getHistory({
      moduleId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return parseHistory(history);
};

PublishHistoryService.getSummary = async ({ moduleId, seriesId, newVersion, oldVersion }) => {
  const { content_summary = [], settings_summary = [] } = await get(
    ApiUrls.getSummary({
      moduleId,
      query: {
        forSeries: seriesId,
        newVersion,
        oldVersion
      }
    })
  );
  return parseSummary({ content: content_summary, settings: settings_summary });
};

PublishHistoryService.discardChanges = async ({ moduleId, seriesId }) => {
  const response = await del(
    ApiUrls.discardChanges({
      moduleId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return response;
};

PublishHistoryService.publishChanges = async ({
  moduleId,
  seriesId,
  companyId,
  data: { inviteLearner, notify }
}) => {
  const response = await post(
    ApiUrls.publishChanges({
      moduleId,
      companyId,
      query: {
        forSeries: seriesId,
        upgrade: inviteLearner,
        sendEmails: notify
      }
    }),
    {
      body: {}
    }
  );
  return response;
};

PublishHistoryService.getInvitedLearnersCount = async ({ moduleId, companyId, seriesId }) => {
  const { entities = {} } = await post(
    ApiUrls.getInvitedLearnerCounts({
      companyId,
      query: {
        forSeries: seriesId,
        entities: moduleId
      }
    }),
    {
      body: {
        isTrackPage: true
      }
    }
  );
  const { ACTIVE: active, COMPLETED: completed, ADDED: added } = entities[moduleId] || {};
  return {
    active,
    completed,
    added
  };
};

PublishHistoryService.getTodos = async ({ moduleId, seriesId }) => {
  const { todos = {} } = await get(
    ApiUrls.getTodos({
      moduleId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return todos.totalErrors;
};

export default PublishHistoryService;
