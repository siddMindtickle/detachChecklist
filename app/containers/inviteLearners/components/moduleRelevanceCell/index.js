import React from "react";

import PropTypes from "prop-types";

import style from "./index.scss";
import { Radio } from "@mindtickle/mt-ui-components";
import {
  MODULE_RELEVANCE_DROPDOWN_OPTIONS,
  INVITE_TYPE,
  MODULE_RELEVANCE_VALUES
} from "../../config/constants";

const ModuleRelevanceCell = ({
  isAllSelected,
  data,
  selectionData,
  moduleRelevanceSelection,
  learners,
  rowIndex,
  handleRelevanceUpdate,
  defaultModuleRelevanceSelection,
  type
}) => {
  let uniqueId = "";
  switch (type) {
    case INVITE_TYPE.INVITE_GROUP:
      uniqueId = data[rowIndex].id;
      break;
    case INVITE_TYPE.INVITE_EXISTING:
      uniqueId = learners[data[rowIndex]].id;
      break;
    case INVITE_TYPE.ADD_INVITE_NEW:
    case INVITE_TYPE.UPLOAD_LIST:
      uniqueId = data.email;
      break;
  }

  return (
    <div className={style.relevance}>
      {!isAllSelected ? (
        <div>
          {(!selectionData || selectionData.indexOf(uniqueId) > -1) && (
            <div key="relevanceRadioOptions" className={style.radioWrapper}>
              <Radio.Group
                disabled={isAllSelected}
                className={style.radioGroupStyle}
                value={moduleRelevanceSelection[uniqueId] || defaultModuleRelevanceSelection}
                onChange={e => {
                  handleRelevanceUpdate({
                    value: e.target.value,
                    key: uniqueId
                  });
                }}
              >
                {MODULE_RELEVANCE_DROPDOWN_OPTIONS.map(option => {
                  return (
                    <Radio
                      key={option.value}
                      className={style.radioOptionStyle}
                      value={option.value}
                    >
                      <span>{option.text} </span>
                    </Radio>
                  );
                })}
              </Radio.Group>
              <div className={style.clear} />
            </div>
          )}
        </div>
      ) : (
        <div className={style.disabledRelevanceValue}>
          {
            MODULE_RELEVANCE_VALUES[
              (moduleRelevanceSelection && moduleRelevanceSelection[uniqueId]) ||
                defaultModuleRelevanceSelection
            ]
          }
        </div>
      )}
    </div>
  );
};

ModuleRelevanceCell.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  rowIndex: PropTypes.number,
  learners: PropTypes.object,
  selectionData: PropTypes.any,
  moduleRelevanceSelection: PropTypes.any,
  handleRelevanceUpdate: PropTypes.any,
  defaultModuleRelevanceSelection: PropTypes.any,
  isAllSelected: PropTypes.any,
  type: PropTypes.string
};

export default ModuleRelevanceCell;
