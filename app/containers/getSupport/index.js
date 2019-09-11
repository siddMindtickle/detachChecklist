import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import classnames from "classnames";

import { TOGGLE_HELP_MODAL, SEND_FEEDBACK } from "./actionTypes";

import reducer from "./reducer";
import saga from "./saga";
import { intl } from "./utils";

import { injectReducer, injectSaga, getActions } from "@core/helpers";

import Alert from "@utils/alert";
import { noop } from "@utils";

import Modal from "@components/modal";
import Button from "@components/button";

import AttachmentNote from "./components/attachmentNote";
import Copyright from "./components/copyright";

import Form from "@containers/form";
import TextField from "@containers/form/components/textField";
import SubmitButton from "@containers/form/components/submitButton";
import TextArea from "@containers/form/components/textArea";
import FieldContainer from "@containers/form/components/fieldContainer";

import style from "./assests/styles/index.scss";

class GetSupport extends Component {
  static propTypes = {
    showModal: PropTypes.bool,
    toggleModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    loaded: PropTypes.bool,
    hasError: PropTypes.bool,
    submit: PropTypes.func.isRequired,
    className: PropTypes.string,
    initiator: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    email: PropTypes.string
  };

  static defaultProps = {
    email: "",
    onClose: noop
  };

  submit = data => {
    const {
      email: { value: email },
      summary: { value: summary },
      description: { value: description = "" }
    } = data;
    if (!this.props.isLoading) this.props.submit({ email, summary, description });
  };

  getModalBody = () => {
    const { isLoading, email } = this.props;
    return [
      <Form
        name="help"
        onSubmit={this.submit}
        className={style.formWrapper}
        key="helpForm"
        onKeyDown={e => {
          e.stopPropagation();
        }}
      >
        <FieldContainer className={style.scrollWrapper}>
          <FieldContainer className={classnames("marginAuto", "width552")}>
            <TextField
              name="email"
              value={email}
              disabled={!!email}
              placeholder={intl.formatMessage({
                id: "SUPPORT_EMAIL_PLACEHOLDER"
              })}
              validate={["required", "email"]}
              tabIndex={2}
              className={style.inputLg}
            />
            <br />
            <TextField
              name="summary"
              placeholder={intl.formatMessage({
                id: "SUPPORT_SUMMARY_PLACEHOLDER"
              })}
              counter={false}
              validate={["required"]}
              className={style.inputLg}
            />
            <AttachmentNote tabIndex={4} />
            <TextArea
              name="description"
              placeholder={intl.formatMessage({
                id: "SUPPOR_DESC_PLACEHOLDER"
              })}
              tabIndex={5}
              className={style.getSupportTextArea}
            />
            <Copyright tabIndex={6} />
          </FieldContainer>
        </FieldContainer>
        <FieldContainer className="modal_footerWrapper">
          <Button
            name="cancel"
            onClick={this.close}
            type="DefaultSm"
            className="marginR10"
            tabIndex={7}
          >
            {intl.formatMessage({
              id: "HM_MSG_CANCEL"
            })}
          </Button>
          <SubmitButton
            name="sendFeedback"
            buttonType="PrimarySm"
            className="marginR10"
            tabIndex={8}
          >
            {!isLoading
              ? intl.formatMessage({
                  id: "SEND_TXT"
                })
              : intl.formatMessage({
                  id: "HM_BTN_SENDING"
                })}
          </SubmitButton>
        </FieldContainer>
      </Form>
    ];
  };
  close = () => {
    this.toggleModal(false);
  };

  toggleModal = show => {
    this.props.toggleModal(show);
    this.props.onClose(show);
  };

  getModal = () => {
    const { showModal, className } = this.props;
    if (showModal) {
      return (
        <Modal
          show={showModal}
          close={this.close}
          body={this.getModalBody()}
          title={intl.formatMessage({ id: "GOT_STUCK" })}
          modaltype="ModalLarge"
          className={className}
        />
      );
    }
  };

  componentDidUpdate(prevProps) {
    const { hasError, loaded } = this.props;
    if (!hasError && loaded && loaded != prevProps.loaded) {
      this.close();
      return Alert(intl.formatMessage({ id: "SUPPORT_THANKS" }));
    }
  }

  render() {
    const { className, initiator } = this.props;
    return [
      <div key="getSupportIcon" className={className} onClick={() => this.toggleModal(true)}>
        {initiator}
      </div>,
      <div key="getModal">{this.getModal()}</div>
    ];
  }
}

const mapStateToProps = state => {
  return {
    showModal: state.help.showModal,
    isLoading: state.help.isLoading,
    loaded: state.help.loaded,
    hasError: state.help.hasError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: show => {
      dispatch(getActions(TOGGLE_HELP_MODAL)({ showModal: !!show }));
    },
    submit: ({ email, summary, description }) => {
      dispatch(getActions(SEND_FEEDBACK)({ email, summary, description }));
    }
  };
};

const withReducer = injectReducer({
  name: "help",
  reducer: reducer
});
const withSaga = injectSaga({ name: "help", saga: saga });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(GetSupport);
