import React from "react";
import ReactDOM from "react-dom";
import Toast from "@components/toast";

const MountOn = document.getElementById("toast");

const show = ({ message, type = "success", ...rest }) => {
  if (message) {
    ReactDOM.render(<Toast message={message} type={type} onHide={hide} {...rest} />, MountOn);
  }
};

function hide() {
  ReactDOM.unmountComponentAtNode(MountOn);
}

export const errorToast = ({ message, ...rest }) => {
  show({ message, type: "error", ...rest });
};
export const successToast = ({ message, ...rest }) => {
  show({ message, type: "success", ...rest });
};
export const warningToast = ({ message, ...rest }) => {
  show({ message, type: "warning", ...rest });
};
export const infoToast = ({ message, ...rest }) => {
  show({ message, type: "info", ...rest });
};

export default show;
