import { Divider, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";
import { OVERVIEW_ID } from "@config/env.config";
import { TASK_NAVIGATION } from "../../config/constants";

import Icon from "@mindtickle/mt-ui-components/Icon";
import Attachments from "@components/attachments_learner";
//import classnames from "classnames";
import MtButton from "@uielements/button";
import PropTypes from "prop-types";
import React from "react";

const MarkCompleteButton = ({ frozen, onClick, isCompleted, updatingTask }) => {
  let messageId = isCompleted ? "COMPLETED" : "RM_CHECKLIST_MARK_COMPLETE";
  if (updatingTask) {
    messageId = isCompleted ? "RM_CHECKLIST_MARKING_INCOMPLETE" : "RM_CHECKLIST_MARKING_COMPLETE";
  }
  return (
    <MtButton
      type={isCompleted ? "success" : "primary"}
      ghost={!isCompleted}
      loading={updatingTask}
      disabled={frozen}
      style={{ verticalAlign: "middle" }}
      onClick={() => onClick(!isCompleted)}
    >
      <Row className="floatR">
        {!updatingTask && (
          <Col xs={6} sm={6} md={2} lg={2} xl={2} xxl={2}>
            <div className="F16 marginT1 paddingL1 paddingR1" />
            <Icon className={"F16"} type={"confirmOutline"} />
          </Col>
        )}
        <Col xs={0} sm={0} md={22} lg={22} xl={22} xxl={22}>
          <div className="marginL10 ellipsis1 F13">{<FormattedMessage id={messageId} />}</div>
        </Col>
      </Row>
    </MtButton>
  );
};
MarkCompleteButton.propTypes = {
  frozen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  updatingTask: PropTypes.bool.isRequired
};

const MoveButton = ({ type, messageId, to, onClick, disabled }) => {
  let classes = {
    btn: "",
    text: ""
  };
  switch (type) {
    case TASK_NAVIGATION.NEXT:
    case TASK_NAVIGATION.EXIT:
      classes.btn = "marginR5 floatR";
      classes.text = "textalign_R";
      break;
    case TASK_NAVIGATION.PREV:
      classes.btn = "marginL5";
      classes.text = "textalign_L";
      break;
  }
  return (
    <MtButton
      className={classes.btn}
      type="noborderPrimary"
      style={{ display: "block" }}
      ghost
      disabled={disabled}
      onClick={() => onClick(to, type)}
    >
      <Row>
        {type == TASK_NAVIGATION.PREV && (
          <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4} className={classes.text}>
            <div className="F12 paddingR7" style={{ lineHeight: "30px" }} />
            <Icon type="left_caret" className={"displayIB"} />
          </Col>
        )}
        <Col xs={0} sm={0} md={0} lg={20} xl={20} xxl={20} className="textalign_L">
          <div className="lineHeight30 F13">
            <FormattedMessage id={messageId} />
          </div>
        </Col>
        {(type === TASK_NAVIGATION.NEXT || type === TASK_NAVIGATION.EXIT) && (
          <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4} className="textalign_L">
            <div
              className={(type !== TASK_NAVIGATION.NEXT ? "icon-signOut" : "") + ""}
              style={{ lineHeight: "30px" }}
            />
            {type === TASK_NAVIGATION.NEXT ? (
              <Icon type={"right_caret"} className={"displayIB paddingL5"} />
            ) : null}
          </Col>
        )}
      </Row>
    </MtButton>
  );
};
MoveButton.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  messageId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(TASK_NAVIGATION)),
  disabled: PropTypes.bool
};
MoveButton.defaultProps = {
  disabled: false
};

const ChecklistTask = ({
  actions,
  nextId,
  medias,
  prevId,
  frozen,
  isCompleted,
  updatingTask,
  isSequentiallyLocked
}) => {
  return [
    <div key="taskMedia" className={"paddingL20"}>
      {medias && (
        <Attachments
          className="overflow marginB10 marginT15"
          attachedMedia={medias}
          truncateCount={4}
          showThumbnails={true}
          showPreview={true}
        />
      )}
    </div>,
    <Divider key="btnDivider" style={{ margin: "30px 0 10px" }} />,
    <Row key="footerBtns">
      <Col xs={8} sm={8} md={6} lg={8} xl={8} xxl={8}>
        <MoveButton
          type={TASK_NAVIGATION.PREV}
          to={prevId}
          onClick={actions.move}
          messageId={prevId !== OVERVIEW_ID ? "RM_CHECKLIST_PREVIOUS_TASK" : "TXT_DESC_HEADER_2"}
        />
      </Col>
      <Col xs={8} sm={8} md={12} lg={8} xl={8} xxl={8} className="textalign_C">
        <MarkCompleteButton
          frozen={frozen}
          updatingTask={updatingTask}
          isCompleted={isCompleted}
          onClick={actions.toggleComplete}
        />
      </Col>
      <Col xs={8} sm={8} md={6} lg={8} xl={8} xxl={8} className="textalign_R">
        <MoveButton
          type={nextId ? TASK_NAVIGATION.NEXT : TASK_NAVIGATION.EXIT}
          to={nextId}
          onClick={nextId ? actions.move : actions.gotoSeries}
          disabled={!isCompleted && isSequentiallyLocked}
          messageId={nextId ? "RM_CHECKLIST_NEXT_TASK" : "EXIT_CHECKLIST"}
        />
      </Col>
    </Row>
  ];
};

ChecklistTask.propTypes = {
  actions: PropTypes.shape({
    toggleComplete: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired
  }).isRequired,
  prevId: PropTypes.string,
  nextId: PropTypes.string,
  attachments: PropTypes.object,
  updatingTask: PropTypes.bool.isRequired,
  frozen: PropTypes.bool.isRequired,
  isSequentiallyLocked: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired
};

ChecklistTask.defaultProps = {
  prevId: OVERVIEW_ID
};

export default ChecklistTask;
