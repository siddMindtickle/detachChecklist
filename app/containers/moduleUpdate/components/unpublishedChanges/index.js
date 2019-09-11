import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Button from "@components/button";
import Dropdown from "@components/dropdown";
import Radio from "@components/radio";
import Icon from "@components/icon";
import TodoError from "@components/todoError";

import style from "./index.scss";

import { INVITE_OPTIONS, INVITE_TYPES, INVITE_TYPES_DETAILS } from "../../config/constants";
import PublishedChanges from "../../components/publishedChanges";

const getInviteOptions = moduleType => {
  return INVITE_OPTIONS.map(type => {
    const { title } = INVITE_TYPES_DETAILS[type];
    return { text: title(moduleType), value: type };
  });
};

const NotifyBox = ({ notify, toggleNotify }) => {
  return (
    <div className={style.ph_notifyEmail}>
      <Icon type="todo" />
      <div className={style.ph_notifyText}>
        Notify selected learners about this update via email?{" "}
      </div>
      <span className={style.radio_notifyEmail}>
        <Radio checked={notify == true} onClick={() => toggleNotify(true)} label="Yes" />
        <Radio checked={notify == false} onClick={() => toggleNotify(false)} label="No" />
      </span>
    </div>
  );
};
NotifyBox.propTypes = {
  notify: PropTypes.bool.isRequired,
  toggleNotify: PropTypes.func.isRequired
};

const InviteDropdown = props => {
  const {
    className,
    inviteDetails,
    moduleType,
    inviteType,
    onSelect,
    learnerCounts,
    ...rest
  } = props;

  return (
    <div>
      <div className={classnames(style.publishPushChanges, className)}>
        <div className={style.publishPushChangesText}>Push these changes for</div>
        <Dropdown
          id="publish-history-invite-option"
          options={getInviteOptions(moduleType)}
          onSelect={onSelect}
          setTitle={true}
          title={inviteDetails.title(moduleType)}
          className="ph-moduleUnpublishedDrpdown"
        />
      </div>
      <div className={style.publishChangesNote}>
        {inviteDetails.getWarningText(learnerCounts, moduleType)}
      </div>
      {inviteType !== INVITE_TYPES.INVITE_NONE && <NotifyBox {...rest} />}
    </div>
  );
};

InviteDropdown.propTypes = {
  className: PropTypes.string,
  inviteDetails: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  moduleType: PropTypes.string.isRequired,
  inviteType: PropTypes.string.isRequired,
  learnerCounts: PropTypes.object
};

class UnpublishedChanges extends Component {
  static propTypes = {
    todos: PropTypes.number.isRequired,
    showTodos: PropTypes.func.isRequired,
    summary: PropTypes.array.isRequired,
    moduleType: PropTypes.string,
    showInviteOptions: PropTypes.bool.isRequired,
    defaultInviteOption: PropTypes.string.isRequired,
    discard: PropTypes.func.isRequired,
    publish: PropTypes.func.isRequired,
    operationInProgress: PropTypes.bool.isRequired,
    learnerCounts: PropTypes.object
  };
  state = {
    invite: this.props.defaultInviteOption,
    notify: false
  };

  onSelect = value => {
    this.setState({ invite: value });
  };

  toggleNotify = notify => {
    this.setState({ notify });
  };

  render() {
    const {
      summary,
      discard,
      publish,
      todos,
      showTodos,
      moduleType,
      showInviteOptions,
      operationInProgress,
      learnerCounts
    } = this.props;
    const { notify, invite } = this.state;
    const inviteDetails = INVITE_TYPES_DETAILS[invite];
    return (
      <div className={style.ph_unpublished}>
        {todos ? <TodoError todoCount={todos} openTodos={showTodos} /> : null}
        {showInviteOptions ? (
          <InviteDropdown
            moduleType={moduleType}
            inviteDetails={inviteDetails}
            inviteType={invite}
            onSelect={this.onSelect}
            className={todos ? style.withTodos : ""}
            toggleNotify={this.toggleNotify}
            notify={notify}
            learnerCounts={learnerCounts}
          />
        ) : (
          <div>
            <div
              className={classnames({
                [style.invitemsg]: todos,
                [style.invitemsgDefaultstyle]: !todos
              })}
            >
              {inviteDetails.message(moduleType)}
            </div>
            <NotifyBox toggleNotify={this.toggleNotify} notify={notify} />
          </div>
        )}
        <PublishedChanges summary={summary} />
        <div>
          <div className={style.ph_footer}>
            <Button
              name="discard"
              type="DefaultSm"
              onClick={discard}
              disabled={operationInProgress}
            >
              Discard Changes
            </Button>
            <Button
              name="publish"
              type="PrimarySm"
              disabled={!!todos || operationInProgress}
              onClick={() => publish({ inviteLearner: inviteDetails.value, notify })}
            >
              Update Module
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UnpublishedChanges;
