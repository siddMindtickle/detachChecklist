import React, { Component } from "react";
import PropTypes from "prop-types";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";

import Popover from "@components/popover";
import Button from "@components/button";
import { Radio } from "@mindtickle/mt-ui-components";
import Icon from "@components/icon";
import Modal from "@components/modal";

import { debounce } from "@utils";

import classnames from "classnames";
import style from "./index.scss";

const getModuleRelevanceSelectionPopupContent = (selectedValue, updateValue, confirm) => {
  return (
    <div>
      <div key="mainText" className={style.popHeading}>
        Change the Module Relevance of selected learners ?
      </div>
      <div key="relevanceRadioOptions" className={style.radioWrapper}>
        <Radio.Group
          className={style.radioGroupStyle}
          value={selectedValue}
          onChange={e => updateValue(e.target.value)}
        >
          <Radio className={style.radioOptionStyle} value={"REQ"}>
            <span>{"Required"} </span>
          </Radio>
          <Radio className={style.radioOptionStyle} value={"OPT"}>
            <span>{"Optional"} </span>
          </Radio>
          <Radio className={style.radioOptionStyle} value={"NONE"}>
            <span>{"Unmarked"} </span>
          </Radio>
        </Radio.Group>
        <div className={style.clear} />
      </div>

      <div className={style.actionButtonsPanel}>
        <Button
          key="cancel"
          onClick={() => {
            confirm(false);
          }}
          type="DefaultSm"
          className={"marginR20"}
        >
          {"Cancel"}
        </Button>

        <Button
          key="ok"
          onClick={() => {
            confirm(true);
          }}
          disabled={!selectedValue}
          type="PrimarySm"
        >
          {"Change"}
        </Button>
      </div>
    </div>
  );
};

const RelevanceSelectionPopover = ({ selectedValue, updateValue, confirm }) => {
  return (
    <Popover id="relevanceSelectionPopover">
      {getModuleRelevanceSelectionPopupContent(selectedValue, updateValue, confirm)}
    </Popover>
  );
};

RelevanceSelectionPopover.propTypes = {
  updateValue: PropTypes.func,
  selectedValue: PropTypes.string.isRequired,
  confirm: PropTypes.func
};

export default class RelevanceSelectionPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    select: PropTypes.func,
    defaultValue: PropTypes.string,
    isModal: PropTypes.bool,
    onModalClose: PropTypes.func
  };

  state = {
    selectedValue: this.props.defaultValue,
    showModal: true
  };

  updateValue = selectedValue => {
    this.setState({ selectedValue });
  };

  onModalConfirm = confirm => {
    if (confirm) this.props.select(this.state.selectedValue);
    this.setState({ showModal: false, selectedValue: "" });
    this.props.onModalClose();
  };

  confirm = shouldChange => {
    const delayedSetState = debounce(() => {
      const { defaultValue } = this.props;
      this.setState({ selectedValue: defaultValue });
    }, 2000);

    const { selectedValue } = this.state;
    if (shouldChange)
      this.props.select({
        key: "ALL",
        value: selectedValue
      });

    this.overlay.hide();

    delayedSetState();
  };

  render() {
    return this.props.isModal ? (
      <Modal
        key="moduleRelevanceSelectionPopup"
        body={getModuleRelevanceSelectionPopupContent(
          this.state.selectedValue,
          this.updateValue,
          this.onModalConfirm
        )}
        show={this.state.showModal}
        //close={this.closeModal}
        modaltype="ModalSmall"
        className={style.modalWrapper}
      />
    ) : (
      <div
        className={classnames(
          style.relevanceSelectionStyle,
          "relevanceSelection",
          this.props.className
        )}
      >
        <OverlayTrigger
          trigger="click"
          rootClose={false}
          container={this}
          ref={ref => (this.overlay = ref)}
          overlay={
            <RelevanceSelectionPopover
              selectedValue={this.state.selectedValue}
              updateValue={this.updateValue}
              confirm={this.confirm}
            />
          }
        >
          <div className={style.popupTriggerText}>
            <span> Change </span>
            <Icon type="Down_arrow" className={style.popupTriggerIcon} />
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}
