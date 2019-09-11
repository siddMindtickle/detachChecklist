export const getTrackingParams = props => {
  const { moduleId, moduleName, moduleType } = props;
  return {
    module_id: moduleId,
    module_name: moduleName,
    module_type: moduleType,
    location: "module_setting_popup"
  };
};
