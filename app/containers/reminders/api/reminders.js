import moment from "moment";
import { get, post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";

import {
  START,
  SIZE,
  OPERATIONS,
  REMINDER_TYPES,
  LEARNER_STATUS_MAP,
  NO_TEMPLATE_OPTION,
  TEMPLATE_ID_DEFAULT_VALUE,
  REMINDER_TYPE_VALUE_BY_CONDITION,
  GET_CONDITION_SCHEDULE_BY_REMINDER_TYPE
} from "../config/constants";

const { UPDATE, ADD, REMOVE } = OPERATIONS;

const ReminderService = {};
const parseTemplates = ({ templates }) => {
  const parsedTemplates = Object.values(templates).reduce((parsedTemplates, template) => {
    parsedTemplates[template.id] = { name: template.name, id: template.id };
    if (template.replaces)
      parsedTemplates[template.replaces] = {
        name: template.name,
        id: template.id
      };
    return parsedTemplates;
  }, {});
  const { id: noTemplateId, name: noTemplateName } = NO_TEMPLATE_OPTION;
  parsedTemplates[noTemplateId] = { id: noTemplateId, name: noTemplateName };

  return { ...parsedTemplates };
};

const parseReminders = ({ reminders }) => {
  const response = {};
  reminders.forEach(reminder => {
    const { schedule, condition, task: learnerStatus, id, templateId, mailJobId } = reminder;
    response[id] = {
      id,
      learnerStatusId: reminder.task,
      ...REMINDER_TYPE_VALUE_BY_CONDITION({
        schedule: schedule ? +schedule : null,
        condition,
        learnerStatus,
        templateId,
        mailJobId
      })
    };
  });
  return response;
};

const parseAutomations = ({ automations }) => {
  const response = {
    learnerStatus: {},
    reminders: {}
  };

  for (const [learnerStatusId, reminders = []] of Object.entries(automations)) {
    const { name, multipleReminders, displayIndex } = LEARNER_STATUS_MAP[learnerStatusId];
    response.learnerStatus[learnerStatusId] = {
      name,
      id: learnerStatusId,
      multipleReminders,
      displayIndex
    };
    response.reminders = {
      ...response.reminders,
      ...parseReminders({ reminders })
    };
  }
  return response;
};

const parseOperationResponse = ({ create, update, delete: deleted }) => {
  const deletedReminders = deleted.reduce((result, reminder) => {
    result[reminder.id] = null;
    return result;
  }, {});
  return {
    ...parseReminders({ reminders: [...create, ...update] }),
    ...deletedReminders
  };
};

const getConditionSchedule = ({ learnerStatusId, type, time, moduleId, companyId }) => {
  if (!type) return { condition: null, schedule: null };
  const rawCondition = LEARNER_STATUS_MAP[learnerStatusId].getCondition({
    moduleId,
    companyId,
    type
  });
  const { condition, schedule } = GET_CONDITION_SCHEDULE_BY_REMINDER_TYPE({
    condition: rawCondition,
    type,
    time
  });
  return {
    condition,
    schedule
  };
};

const getParams = (data, moduleId, companyId) => {
  const { reminderId, type, value, templateId: templateIdFromData, learnerStatusId } = data;

  const time =
    type === REMINDER_TYPES.EPOCH
      ? moment(value)
          .seconds(0)
          .unix()
      : value;

  const { condition, schedule } = getConditionSchedule({
    moduleId,
    companyId,
    type,
    time,
    learnerStatusId
  });

  const templateId = templateIdFromData
    ? templateIdFromData
    : TEMPLATE_ID_DEFAULT_VALUE(learnerStatusId);

  return {
    id: reminderId,
    task: learnerStatusId,
    templateId,
    condition,
    schedule
  };
};

const preProcessOperationData = ({ operation, data = {}, moduleId, companyId }) => {
  const response = {
    update: [],
    create: [],
    delete: []
  };

  const { reminderId: id, mailJobId } = data;
  switch (operation) {
    case UPDATE:
      response.update.push(getParams(data, moduleId, companyId));
      break;
    case ADD:
      response.create.push(getParams(data, moduleId, companyId));
      break;
    case REMOVE:
      response.delete.push({ id, mailJobId });
      break;
  }
  return response;
};

ReminderService.getMailTemplates = async ({ companyId, seriesId, start = START, count = SIZE }) => {
  const { templates } = await get(
    ApiUrls.getMailTemplates({
      companyId,
      query: {
        start,
        count,
        forSeries: seriesId
      }
    })
  );
  return parseTemplates({ templates });
};

ReminderService.getReminderAutomations = async ({ companyId, moduleId, seriesId }) => {
  const response = await get(
    ApiUrls.getReminderAutomations({
      companyId,
      moduleId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return parseAutomations({ automations: response });
};

ReminderService.operateReminders = async ({ moduleId, seriesId, companyId, operation, data }) => {
  const response = await post(
    ApiUrls.operateReminders({
      companyId,
      moduleId,
      query: {
        forSeries: seriesId
      }
    }),
    {
      body: {
        ...preProcessOperationData({ operation, data, moduleId, companyId })
      }
    }
  );
  return parseOperationResponse(response);
};

export default ReminderService;
