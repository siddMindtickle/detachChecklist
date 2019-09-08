import React from "react";
import ReactDOM from "react-dom";
import Alert from "@components/alert";

const AlertContainerRef = (() => {
  const MountOn = document.getElementById("alerts");
  const ref = ReactDOM.render(<Alert />, MountOn); //eslint-disable-line
  return () => ref;
})();

const showAlert = (message, options) => {
  AlertContainerRef().show(message, options);
};

export const showConfirmBox = (message, options) => {
  AlertContainerRef().show(message, { ...options, confirm: true });
};

export const closeAll = () => {
  AlertContainerRef().removeAll();
};

export default showAlert;
