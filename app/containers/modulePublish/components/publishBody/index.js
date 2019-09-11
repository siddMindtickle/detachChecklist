import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Checkbox from "@components/checkbox";
import Button from "@components/button";
import TodoError from "@components/todoError";
import PublishWithSelection from "../publishWithSelection";

import { showTodos } from "@containers/todos";

import { LEARNER_TYPES, getConfirmationMessage } from "../../config/constants";

import style from "./index.scss";

const Confirmation = ({ count, moduleType }) => (
  <div className={style.popUpHeading}>{getConfirmationMessage(count, moduleType)}</div>
);

Confirmation.propTypes = {
  count: PropTypes.number,
  moduleType: PropTypes.string.isRequired
};

class PublishBody extends Component {
  static propTypes = {
    count: PropTypes.object,
    data: PropTypes.object.isRequired,
    seriesName: PropTypes.string,
    actions: PropTypes.object,
    onPublish: PropTypes.func,
    moduleType: PropTypes.string.isRequired
  };

  state = {
    notify: true,
    numOfSelectedLearners: this.props.count.learners.fullCount,
    learnerType: LEARNER_TYPES.FULL,
    selectedType: LEARNER_TYPES.FULL, // to maintain the state when LearnerTypes.NONE is selected
    selectedOptions: {}
  };

  handlePublish = () => {
    const { numOfSelectedLearners, learnerType, notify, selectedOptions } = this.state;
    const {
      count: {
        learners: { hasPrivateSeries, noLearners }
      }
    } = this.props;
    let publishOptions = {};

    if (!noLearners) {
      publishOptions = { type: learnerType, numOfSelectedLearners, notify };
      if (hasPrivateSeries) {
        if (learnerType === LEARNER_TYPES.NONE) {
          publishOptions = { type: learnerType };
        } else {
          publishOptions = {
            ...publishOptions,
            ...selectedOptions
          };
        }
      } else {
        publishOptions.isPublic = true;
      }
    }

    this.props.onPublish(publishOptions);
  };

  openTodos = () => this.props.actions.dispatchAction(showTodos());

  handleCheck = () => this.setState({ notify: !this.state.notify });

  handleSelect = params => this.setState(params);

  renderTodos() {
    const { todos: todoCount } = this.props.count;
    if (todoCount) {
      return <TodoError todoCount={todoCount} openTodos={this.openTodos} />;
    }
  }

  renderBody() {
    const {
      learners: { hasPrivateSeries, noLearners, fullCount, allPrivateCount }
    } = this.props.count;
    const { moduleType } = this.props;
    if (noLearners) {
      return <Confirmation moduleType={moduleType} />;
    } else if (hasPrivateSeries && allPrivateCount) {
      const {
        count: { learners: count },
        ...restProps
      } = this.props;
      return (
        <PublishWithSelection
          {...restProps}
          learnerType={this.state.selectedType}
          numOfSelectedLearners={this.state.numOfSelectedLearners}
          count={count}
          onSelect={this.handleSelect}
        />
      );
    }
    return <Confirmation count={fullCount} moduleType={moduleType} />;
  }

  renderNotificationBox() {
    const notify = this.state.notify;
    const {
      learners: { noLearners }
    } = this.props.count;
    if (this.state.learnerType === LEARNER_TYPES.NONE) return;
    if (!noLearners) {
      return (
        <div className={style.notifyLearners}>
          <Checkbox
            name="emailNotification"
            className={style.notifyLearnersCheckbox}
            checked={notify}
            onClick={this.handleCheck}
          />
          <span className={style.notifyLearnersText}>Also notify the learners via email</span>
        </div>
      );
    }
  }

  renderSubmit() {
    const { todos: todoCount } = this.props.count;
    return (
      <div className={style.submitBtnField}>
        <Button
          disabled={!!todoCount}
          name="submitLearners"
          type="PrimarySm"
          onClick={this.handlePublish}
        >
          Confirm Publish
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className={classnames(style.publishBody)}>
        {this.renderTodos()}
        {this.renderBody()}
        {this.renderNotificationBox()}
        {this.renderSubmit()}
      </div>
    );
  }
}

export default PublishBody;
