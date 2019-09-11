import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "@components/modal";
import { showLoader, hideLoader } from "@utils/loader";
import { SUPPORTED_UPLOADER, GET_UPLOADER_URL, UPLOADER_DETAILS } from "./constants";

class Iframe extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    receiveHandler: PropTypes.func.isRequired
  };
  static defaultProps = {
    inline: false
  };
  sendToFrame(data) {
    if (this.ifr) this.ifr.contentWindow.postMessage(data, "*");
  }

  componentDidMount() {
    window.addEventListener("message", this.props.receiveHandler);
    showLoader();

    this.ifr.onload = () => {
      hideLoader();
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handleFrameTasks);
  }

  render() {
    const { url } = this.props;
    return (
      <iframe
        style={{
          width: this.props.inline ? "88vh" : "100%",
          height: "100vh",
          border: "none"
        }}
        src={url}
        ref={f => {
          this.ifr = f;
        }}
      />
    );
  }
}

class Uploader extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.keys(SUPPORTED_UPLOADER)).isRequired,
    target: PropTypes.node.isRequired,
    inline: PropTypes.bool,
    className: PropTypes.string,
    update: PropTypes.func.isRequired
  };
  static defaultProps = {
    inline: false
  };
  state = {
    show: false
  };

  handleIncomingMessage = messageEvent => {
    const { event, ...rest } = messageEvent.data || {};
    const { events: uploaderTypeEvents } = UPLOADER_DETAILS[SUPPORTED_UPLOADER[this.props.type]];
    switch (event) {
      case uploaderTypeEvents.uploaded:
        this.props.update(rest);
        this.closeUploader();
        break;
      case uploaderTypeEvents.close:
        this.closeUploader();
        break;
    }
  };
  getIframe = () => {
    const url = GET_UPLOADER_URL(SUPPORTED_UPLOADER[this.props.type]);
    return (
      <Iframe url={url} inline={this.props.inline} receiveHandler={this.handleIncomingMessage} />
    );
  };
  uploader = () => {
    const { show } = this.state;
    return this.props.inline ? (
      <React.Fragment>{this.getIframe()}</React.Fragment>
    ) : (
      <Modal show={show} body={this.getIframe()} modaltype="ModalLarge" />
    );
  };

  componentWillMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false;
  }

  closeUploader = () => {
    if (this._mounted) this.setState({ show: false });
  };
  showUploader = () => {
    if (this._mounted) this.setState({ show: true });
  };
  render() {
    const { target, className } = this.props;
    return (
      <div className={className}>
        {this.uploader()}
        <span onClick={this.showUploader}>{target}</span>
      </div>
    );
  }
}

export default Uploader;
