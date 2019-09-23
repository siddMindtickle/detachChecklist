import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { Modal } from "antd";
import st from "./index.scss";

import MtButton from "@uielements/button";

class CompletionModal extends Component {
  static propTypes = {
    score: PropTypes.number.isRequired,
    maxScore: PropTypes.number.isRequired,
    gotoOverview: PropTypes.func.isRequired,
    gotoSeries: PropTypes.func.isRequired
  };

  render() {
    const { score, maxScore, gotoSeries, gotoOverview } = this.props;
    return (
      <Modal
        visible={true}
        title={<FormattedMessage id="RM_YOUR_TASK_CHECKLIST_COMPLETE" />}
        footer={[
          <div key="asd" className="textalign_C lineHeight30 blueColor">
            <MtButton
              className={classnames(st.hideforMobile, "displayIB cursor")}
              style={{ padding: "0" }}
              type="noborderPrimary"
              key="goTo Series"
              ghost
              onClick={gotoSeries}
            >
              <FormattedMessage id="GO_TO_SERIES" />
            </MtButton>
            <div
              className={classnames(st.hideforMobile, "displayIB greyColor marginL10 marginR10")}
            >
              |
            </div>
            <MtButton
              className="displayIB cursor"
              style={{ padding: "0" }}
              type="noborderPrimary"
              ghost
              key="goToOverview"
              onClick={gotoOverview}
            >
              <FormattedMessage id="RM_GOTO_CHECKLIST_OVERVIEW" />
            </MtButton>
          </div>
        ]}
      >
        <div className="paddingT35 paddingB35 textalign_C blackColor">
          <div className="F13 lineHeight20">
            <FormattedMessage id="RM_SUCCESS_POPUP" /> <FormattedMessage id="RM_YOUR_FINAL_SCORE" />
          </div>
          <div className="marginT20">
            <div className={classnames("F24 lineHeight30", "greenColor")}>
              <span className="bold">{score}</span> / {maxScore} pts
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CompletionModal;
