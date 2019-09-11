import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Modal from "@components/modal";
import Button from "@components/button";

import Input from "@components/input";

import style from "./index.scss";

export default class CopyToClip extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    copy: PropTypes.func,
    copied: PropTypes.bool,
    title: PropTypes.string,
    close: PropTypes.func.isRequired
  };

  onClose = () => {
    this.props.close();
  };

  render() {
    const { text, copy, copied, title } = this.props;
    let buttonText = "COPY";
    if (copied) buttonText = "Copied";
    return (
      <Modal
        show={true}
        title={title}
        close={this.onClose}
        modaltype="ModalSmall"
        className={classnames(style.copyUrl, "width500", "centerDiv")}
        body={
          <div>
            <Input name="url" disabled={true} value={text} />
            <CopyToClipboard text={text} onCopy={copy}>
              <div className={style.copyButtonBlock}>
                <Button type="PrimarySm">{buttonText}</Button>
              </div>
            </CopyToClipboard>
          </div>
        }
      />
    );
  }
}
