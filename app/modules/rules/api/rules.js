import { get, post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";
import { MT_MODULES_API_KEY_MAP } from "@config/global.config";
import { RULE_STATUS } from "../config/constants";
const RulesService = {};

const parseIdentifier = identifier => ({
  ...identifier,
  moduleType: MT_MODULES_API_KEY_MAP[identifier.moduleType]
});

const parseCondition = condition => {
  const { type, description, identifiers, triads } = condition;
  return {
    type,
    description,
    identifiers: parseGroupList(identifiers, parseIdentifier),
    triads: parseGroupList(triads)
  };
};

const parseAction = action => {
  const { entityType, operation, identifiers = [] } = action;
  return {
    operation,
    entityType,
    identifiers: { data: identifiers.map(parseIdentifier) }
  };
};

const parseGroupList = (data, singleEntityParser) => {
  if (data) {
    const { grouping, data: entities } = data;
    return {
      grouping,
      data: singleEntityParser ? entities.map(singleEntityParser) : entities
    };
  }
};

const parseRuleSingle = ({
  name,
  description,
  status,
  id,
  createdAt,
  createdBy,
  conditions,
  actions
}) => ({
  name: name || "Unnamed Rule",
  description: description || "",
  status,
  id,
  createdAt,
  createdBy,
  isActive: status === RULE_STATUS.ACTIVE,
  conditions: parseGroupList(conditions, parseCondition),
  actions: parseGroupList(actions, parseAction)
});

const parseAllRules = ({ rules = [] }) => {
  let partition = 0;
  return rules.reduce(
    (acc, rule) => {
      const parsedRule = parseRuleSingle(rule);
      acc.data[rule.id] = parsedRule;
      acc.items.splice(parsedRule.isActive ? partition++ : acc.items.length, 0, rule.id);
      return acc;
    },
    { data: {}, items: [] }
  );
};

const parseRule = rule => ({
  ...parseRuleSingle(rule),
  fetched: true
});

RulesService.getRulesStatus = async ({ companyId }) => {
  try {
    const response = await get(ApiUrls.fetchRulesStatus({ companyId }));
    return response;
  } catch (error) {
    throw error;
  }
};

RulesService.getAllRules = async ({ companyId }) => {
  try {
    const response = await get(ApiUrls.fetchRules({ companyId }));
    return parseAllRules(response);
  } catch (error) {
    throw error;
  }
};

RulesService.fetchRuleSingle = async ({ ruleId, companyId }) => {
  try {
    const response = await get(ApiUrls.fetchRule({ ruleId, companyId }));
    return parseRule(response);
  } catch (error) {
    throw error;
  }
};

RulesService.changeRulesStatus = async ({ companyId, status }) => {
  try {
    const response = await post(ApiUrls.changeRulesStatus({ companyId }), {
      body: { status }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

RulesService.updateRule = async ({ id: ruleId, companyId, ...data }) => {
  try {
    const response = await post(ApiUrls.updateRule({ ruleId, companyId }), {
      body: data
    });
    return { [ruleId]: parseRule(response) };
  } catch (error) {
    throw error;
  }
};

export default RulesService;
