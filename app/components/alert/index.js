import React, { Component } from "react";
import PropTypes from "prop-types";
import nanoid from "nanoid";
import classnames from "classnames";

import Modal from "@components/modal";
import Button from "@components/button";

import style from "./index.scss";
const noop = () => undefined;
class AlertBox extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    removeAlert: PropTypes.func.isRequired,
    okBtnText: PropTypes.string,
    closeBtnText: PropTypes.string,
    callback: PropTypes.func,
    type: PropTypes.oneOf(["Confirm", "Alert"])
  };
  static defaultProps = {
    callback: noop
  };
  close = action => {
    const { id, removeAlert, callback } = this.props;
    callback(!!action);
    removeAlert(id);
  };
  body = () => {
    return [
      <div key="body" className={classnames(style.modalContent, "marginT20", "marginB20")}>
        {this.props.children}
      </div>,
      this.props.type == "Confirm" && (
        <Button
          key="cancel"
          onClick={() => {
            this.close(false);
          }}
          type="DefaultSm"
          className={classnames("marginB20", "marginR10")}
        >
          {this.props.closeBtnText || "Cancel"}
        </Button>
      ),
      <Button
        key="ok"
        onClick={() => {
          this.close(true);
        }}
        type="PrimarySm"
        className={"marginB20"}
      >
        {this.props.okBtnText || "OK"}
      </Button>
    ];
  };
  render() {
    return (
      <Modal
        show={true}
        body={this.body()}
        modaltype="ModalSmall"
        className={classnames("width500", "centerDiv")}
      />
    );
  }
}

class Alert extends Component {
  state = {
    alerts: []
  };

  show = (message = "", { confirm, ...rest } = {}) => {
    const alert = {
      id: nanoid(7),
      message,
      type: confirm ? "Confirm" : "Alert",
      ...rest
    };

    this.setState(prevState => ({
      alerts: prevState.alerts.concat(alert)
    }));
    return alert.id;
  };

  removeAll = () => {
    const alertsRemoved = this.state.alerts;
    this.setState({ alerts: [] });
    alertsRemoved.forEach(alert => alert.onClose && alert.onClose());
  };

  removeAlert = id => {
    const alertRemoved = this.state.alerts.filter(alert => alert.id === id)[0];
    this.setState(prevState => ({
      alerts: prevState.alerts.filter(alert => alert.id !== id)
    }));
    alertRemoved && alertRemoved.onClose && alertRemoved.onClose();
  };
  renderAlerts = () => {
    return this.state.alerts.map(alert => {
      return (
        <AlertBox {...alert} key={alert.id} removeAlert={this.removeAlert}>
          {alert.message}
        </AlertBox>
      );
    });
  };
  render() {
    return this.renderAlerts();
  }
}

export default Alert;
