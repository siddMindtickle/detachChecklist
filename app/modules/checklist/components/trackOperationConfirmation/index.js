/* eslint-disable react/no-unescaped-entities */
import React from "react";
import PropTypes from "prop-types";

import { OPERATIONS } from "../../config/track.constants";

const { RESET_PROGRESS, REMOVE_LEARNERS, CHANGE_RELEVANCE } = OPERATIONS;
import { Radio } from "@mindtickle/mt-ui-components";
import style from "./index.scss";

class TrackOperationConfirmation extends React.Component {
  static propTypes = {
    operation: PropTypes.any,
    selectedCount: PropTypes.any,
    feedbackMethod: PropTypes.any
  };

  state = {
    moduleRelevanceSelection: ""
  };

  updateState = value => {
    this.setState({
      moduleRelevanceSelection: value
    });
    this.props.feedbackMethod(value);
  };

  render() {
    const { operation, selectedCount } = this.props;
    const { moduleRelevanceSelection } = this.state;
    switch (operation) {
      case RESET_PROGRESS:
        return [
          <div key="mainText">
            If you reset {selectedCount ? selectedCount + " selected" : "this"} learner's progress,
            he/she will lose all progress on this Checklist and his/her completion status will reset
            to 0%
          </div>,
          <div key="subText">Do you want to proceed?</div>
        ];
      case CHANGE_RELEVANCE:
        return [
          <div key="mainText" className={style.popHeading}>
            Change the Module Relevance of{" "}
            {selectedCount > 1 ? selectedCount + " learners" : "this learner"} to:
          </div>,
          <div key="relevanceRadioOptions" className={style.radioWrapper}>
            <Radio.Group
              className={style.radioGroupStyle}
              value={moduleRelevanceSelection}
              onChange={e => this.updateState(e.target.value)}
            >
              <Radio
                className={style.radioOptionStyle}
                //key={option.value}
                value={"REQ"}
              >
                <span>{"Required"} </span>
              </Radio>
              <Radio
                className={style.radioOptionStyle}
                //key={option.value}
                value={"OPT"}
              >
                <span>{"Optional"} </span>
              </Radio>
              <Radio
                className={style.radioOptionStyle}
                //key={option.value}
                value={"NONE"}
              >
                <span>{"Unmarked"} </span>
              </Radio>
            </Radio.Group>
            <div className={style.clear} />
          </div>
        ];
      case REMOVE_LEARNERS:
        return (
          <div>
            Are you sure you want to remove {selectedCount ? selectedCount + " selected " : "this "}
            Learner
            {selectedCount > 1 ? "s" : ""}?
          </div>
        );
    }
  }
}

export default TrackOperationConfirmation;
