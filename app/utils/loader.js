import React from "react";
import ReactDOM from "react-dom";
import Loader from "@components/loader";
import { Defaults } from "@config/env.config";

const MountOn = document.getElementById("loader");

export const showLoader = (message = Defaults.loaderMessage) => {
  ReactDOM.render(<Loader message={message} type="Full" />, MountOn);
};

export const hideLoader = () => ReactDOM.unmountComponentAtNode(MountOn);
