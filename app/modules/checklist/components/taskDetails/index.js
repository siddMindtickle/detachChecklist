import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import ScoreDropdown from "@components/scoreDropdown";
import Description from "@components/description";
import Attachments from "@components/attachment";
import Input from "@components/input";

import { errorToast as ErrorToast } from "@utils/toast";
import { debounce } from "@utils";
import WithLabel from "@hocs/withLabel";

import { MT_ENTITIES } from "@config/global.config";
import { DEBOUNCE_TIME } from "../../config/constants";

import { TREE_NODE_DEFAULT, BUILD_MESSAGE as MESSAGES } from "../../config/constants";
import style from "./index.scss";

const { TASK, SECTION } = MT_ENTITIES;
const InputWithLabel = WithLabel(Input);
const DescriptionWithLabel = WithLabel(Description);

class TaskDetails extends Component {
  static propTypes = {
    type: PropTypes.oneOf([TASK, SECTION]).isRequired,
    node: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  };
  state = {
    showAddDesc: !this.props.node.data.description
  };
  onNameChange = value => {
    const { type, update } = this.props;
    if (type == SECTION) {
      return value.trim()
        ? update(type, { name: value })
        : ErrorToast({ message: MESSAGES.EMPTY_SECTION_NAME });
    }
    return update(type, { name: value });
  };

  onDescUpdate = debounce(value => {
    const { type, update } = this.props;
    update(type, { description: value });
  }, DEBOUNCE_TIME.DESCRIPTION);

  addAttachment = attachmentToAdd => {
    const { type, update } = this.props;
    update(type, { attachments: { [attachmentToAdd.id]: attachmentToAdd } });
  };
  removeAttachment = attachmentToRemove => {
    const { type, update } = this.props;
    update(type, { attachments: { [attachmentToRemove.id]: undefined } });
  };
  toggleAddDesc = (show = false) => {
    this.setState({
      showAddDesc: show
    });
  };

  renderScore = () => {
    const { type, node = {}, update } = this.props;
    const {
      data: { maxScore }
    } = node;
    return (
      <div className={style.borderSection}>
        <div className={style.scoresection}>
          <span className={style.textStyle}>Max Score on Task completion</span>
          <ScoreDropdown
            id="build_right_section_score"
            title={maxScore || 0}
            infoText={MESSAGES.INFO.SCORE}
            onSelect={value => update(type, { maxScore: value })}
          />
        </div>
      </div>
    );
  };

  renderName = ({ placeholder, label }) => {
    const {
      data: { name = "" }
    } = this.props.node;
    const childProps = {
      name: "title",
      placeholder: placeholder,
      value: name,
      maxLength: 100,
      onChange: event => this.onNameChange(event.target.value),
      className: style.inputCustomClass,
      maxLengthClassName: style.customCounterStylePadding
    };

    return (
      <div key="taskName" className={style.taskNameInput}>
        <InputWithLabel label={label} childProps={childProps} />
        <div className="clear" />
      </div>
    );
  };

  renderDescription = () => {
    const {
      data: { description = "" }
    } = this.props.node;
    const { showAddDesc } = this.state;
    const childProps = {
      maxLength: 1000,
      content: description,
      onChange: this.onDescUpdate,
      id: "sessionDescription"
    };

    return !showAddDesc ? (
      <div key="taskDesc" className={style.taskNameInput}>
        <DescriptionWithLabel label={"Enter Task Description"} childProps={childProps} />
      </div>
    ) : (
      <span
        key="descAddLink"
        onClick={() => this.toggleAddDesc()}
        className={classnames(style.addDescriptionHeading)}
      >
        Add Description
      </span>
    );
  };

  renderTask = () => {
    const {
      data: { attachments = {} }
    } = this.props.node;
    return [
      this.renderName({
        placeholder: TREE_NODE_DEFAULT["leaf"].placeholder,
        label: "Enter Task Name*"
      }),
      this.renderDescription(),
      <div key="renderScore">{this.renderScore()}</div>,
      <div
        key="taskAttachment"
        className={classnames(attachments.length && style.task_attachmented, style.task_attach)}
      >
        <Attachments
          attachmentClassName="attachDocument"
          className={classnames("overflow", "marginB10 marginT15")}
          attachedMedia={attachments}
          truncateCount={4}
          maxUpload={100}
          add={this.addAttachment}
          remove={this.removeAttachment}
        />
      </div>
    ];
  };

  renderSection = () => {
    return this.renderName({
      placeholder: TREE_NODE_DEFAULT["0"].placeholder,
      label: "Enter Section Name*"
    });
  };

  componentWillReceiveProps(nextProps) {
    const { description, id } = nextProps.node.data;
    const { id: oldId } = this.props.node.data;

    if (oldId !== id) {
      this.toggleAddDesc(!description);
    }
  }

  render() {
    const { type } = this.props;
    return (
      <div key="rightSection" className={style.rightSection}>
        <div name="form" onSubmit={this.submit} className={style.formWrapper} key="form">
          {type == TASK ? this.renderTask() : this.renderSection()}
        </div>
      </div>
    );
  }
}

export default TaskDetails;
