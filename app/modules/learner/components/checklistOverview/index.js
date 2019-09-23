import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Divider } from "antd";
import { FormattedMessage } from "react-intl";

import MtButton from "@uielements/button";

// import DownloadCertificate from "@components/downloadCertificate";

const StartBtn = ({ frozen, onClick }) => {
  return (
    <MtButton
      className="marginL10 marginR20 floatR F13"
      key="actionButton"
      type="primary"
      ghost={true}
      disabled={frozen}
      onClick={onClick}
    >
      <div className="floatL lineHeight20">
        <FormattedMessage id="RM_CHECKLIST_START" />
      </div>
      <div className="icon-ddArrowRight marginL7 floatL F10 marginT6" />
      <div className="clear" />
    </MtButton>
  );
};

StartBtn.propTypes = {
  frozen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const ResumeBtn = ({ frozen, onClick }) => {
  return (
    <MtButton
      className="marginL10 marginR20 floatR F13"
      key="actionButton"
      type="primary"
      ghost={true}
      disabled={frozen}
      onClick={onClick}
    >
      <div className="floatL lineHeight20">
        <FormattedMessage id="MSG_PROG_TRAINING" />
      </div>
      <div className="floatL F10 marginT6" />
      <div className="clear" />
    </MtButton>
  );
};

ResumeBtn.propTypes = {
  frozen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const Footer = ({
  // score,
  frozen,
  actions,
  isStarted,
  isCompleted
  // cutoffScore,
  // certificate
}) => {
  const nodes = [<Divider key="divider" style={{ margin: "30px 0 12px" }} />];
  if (isCompleted) {
    // certificate && cutoffScore <= score ? nodes.push(<DownloadCertificate />) : null;
  } else if (isStarted) {
    nodes.push(<ResumeBtn key="resumebtn" frozen={frozen} onClick={actions.resume} />);
  } else if (!(isStarted || isCompleted)) {
    nodes.push(<StartBtn key="startbtn" frozen={frozen} onClick={actions.start} />);
  }
  return nodes.length > 1 ? nodes : null;
};

const ChecklistOverview = props => {
  const { maxScore, totalTasks, cutoffScore, certificate } = props;
  return [
    <Row key="content">
      <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
        <div className={"greyColor textalign_L lineHeight20 F13 paddingL20"}>
          <FormattedMessage id="RM_CHECKLIST_TASKS" />
          <div className="bold blackColor F16">{totalTasks}</div>
        </div>
      </Col>
      <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
        <div className={"greyColor textalign_L lineHeight20 F13"}>
          <FormattedMessage id="LB_TXT_MAX_SCORE" />
          <div className="bold blackColor F16">{maxScore}</div>
        </div>
      </Col>
      <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
        {certificate && (
          <div className={"greyColor textalign_L lineHeight20 F13 paddingR20"}>
            <FormattedMessage id="RM_CHECKLIST_CUTOFF_SCORE" />
            <div className="bold blackColor F16">{cutoffScore}</div>
          </div>
        )}
      </Col>
    </Row>,
    <Row key="actions">
      <Footer {...props} />
    </Row>
  ];
};
ChecklistOverview.propTypes = {
  actions: PropTypes.shape({
    start: PropTypes.func.isRequired,
    resume: PropTypes.func.isRequired
  }),
  totalTasks: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  certificate: PropTypes.bool.isRequired,
  cutoffScore: PropTypes.number
};

export default ChecklistOverview;
