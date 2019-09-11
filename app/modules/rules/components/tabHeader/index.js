import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import withContext from "../../hocs/withModuleContext";

import EditableContent from "../editableContent";
import StatusDisplay from "../status";
import { Button } from "antd";
import "antd/lib/button/style/css";

import style from "./index.scss";

import { showConfirmBox } from "@utils/alert";
import { deepEqual } from "@utils";
import {
  infoToast as InfoToast,
  errorToast as ErrorToast,
  successToast as SuccessToast
} from "@utils/toast";

import { STATUS_CONFIG, OPERATIONS, RULE_ENTITIES } from "../../config/constants";

const TextArea = props => <textarea {...props} />;

class TabHeader extends Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    createdBy: PropTypes.string,
    createdAt: PropTypes.number,
    operationStatus: PropTypes.object,
    manipulateRule: PropTypes.func,
    context: PropTypes.object
  };

  static defaultProps = {
    operationStatus: {}
  };

  componentWillReceiveProps(nextProps) {
    const oldOperationStatus = this.props.operationStatus;
    const newOperationStatus = nextProps.operationStatus;
    const { data: { operation } = {} } = newOperationStatus;
    if (operation === OPERATIONS.UPDATE_RULE) {
      if (!deepEqual(oldOperationStatus, newOperationStatus)) {
        if (newOperationStatus.isLoading) {
          InfoToast({ message: "Saving Changes", load: true });
        } else if (newOperationStatus.hasError) {
          ErrorToast({
            message: `Changes not saved. ${newOperationStatus.error}`
          });
        } else if (newOperationStatus.loaded) {
          SuccessToast({ message: "Changes saved successfully." });
        }
      }
    }
  }

  handleMetadataChange = (type, value) => {
    this.props.manipulateRule({ [type]: value, type });
  };

  toggleRuleStatus = () => {
    const { status } = this.props;
    const { confirm: confirmationMsg, toggleMode } = STATUS_CONFIG[status];
    showConfirmBox(confirmationMsg, {
      callback: confirmed =>
        confirmed &&
        this.props.manipulateRule({
          status: toggleMode,
          type: RULE_ENTITIES.STATUS
        })
    });
  };

  render() {
    const { name, description, status, operationStatus } = this.props;
    const {
      actions: { TOGGLE_META_DATA: toggleMetaData }
    } = this.props.context;
    const deactivateRuleAllowed = !!toggleMetaData;
    return (
      <div className={style.tabContentHeader}>
        <div className={style.tchFirstSection}>
          <div className={style.tabContentInfo}>
            <div className={style.tabContentName}>
              {toggleMetaData ? (
                <EditableContent
                  operationStatus={operationStatus}
                  editClass={style.tcnInput}
                  staticClass={style.tcnStatic}
                  value={name}
                  allowEmpty={false}
                  maxLength={40}
                  maxLengthClassName={style.tcnInputMaxLength}
                  onChange={value => this.handleMetadataChange(RULE_ENTITIES.NAME, value)}
                />
              ) : (
                <div className={classname(style.tcStatic, style.tcnStatic)}>{name}</div>
              )}
            </div>
          </div>
          {deactivateRuleAllowed && (
            <Button
              className={style.tabContentState}
              onClick={this.toggleRuleStatus}
              disabled={!deactivateRuleAllowed}
            >
              {STATUS_CONFIG[status].buttonName}
            </Button>
          )}
        </div>
        <div className={style.tchSecondSection}>
          <StatusDisplay className={style.tabContentStatus} active={status} showDisplayName />
        </div>
        <div className={style.tchThirdSection}>
          {toggleMetaData ? (
            <EditableContent
              operationStatus={operationStatus}
              editClass={style.tcdInput}
              staticClass={style.tcdStatic}
              value={description}
              placeholder="+ Add Description"
              maxLength={1000}
              editComponent={TextArea}
              onChange={value => this.handleMetadataChange(RULE_ENTITIES.DESCRIPTION, value)}
            />
          ) : (
            <div className={classname(style.tcStatic, style.tcdStatic)}>{description}</div>
          )}
        </div>
      </div>
    );
  }
}

export default withContext(TabHeader);
