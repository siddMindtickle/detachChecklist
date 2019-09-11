import classnames from "classnames";
import Icon from "@components/icon";
import Modal from "react-bootstrap/lib/Modal";
import PropTypes from "prop-types";
import React, { Component } from "react";
import style from "./index.scss";

class ModalPopup extends Component {
  static propTypes = {
    id: PropTypes.string,
    close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    show: PropTypes.bool.isRequired,
    footer: PropTypes.node,
    body: PropTypes.node,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ]),
    modaltype: PropTypes.string,
    className: PropTypes.string
  };
  static defaultProps = {
    type: "ModalLarge"
  };

  getModalStyle = modaltype => {
    switch (modaltype) {
      case "ModalSmall":
        return {
          modal: style.modalSm,
          modalBody: style.modalSmPopup
        };
      case "ModalLarge":
        return {
          modal: style.modalLg,
          modalBody: style.modalWrapper
        };
      default:
        return {
          modal: ""
        };
    }
  };

  render() {
    const { modal: modalStyle, modalBody: modalBodyStyle } = this.getModalStyle(
      this.props.modaltype
    );
    return (
      <Modal
        id={this.props.id}
        show={this.props.show}
        dialogClassName="custom-modal"
        className={classnames(modalStyle, this.props.className)}
      >
        <Modal.Header className={!this.props.title && !this.props.close && "displayN"}>
          <div
            onClick={this.props.close}
            className={classnames("closeIcon", !this.props.close && "displayN")}
          >
            <Icon type="close" />
          </div>
          <Modal.Title id="contained-modal-title-lg" tabIndex={0}>
            {this.props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalBodyStyle}>{this.props.body}</Modal.Body>
        <Modal.Footer className={classnames(!this.props.footer && "displayN")}>
          {this.props.footer}
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ModalPopup;
