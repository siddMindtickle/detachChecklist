import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { intlShape } from "react-intl";
import Icon from "@mindtickle/mt-ui-components/Icon";

import { deepEqual } from "@utils";
import MtButton from "@uielements/button";

class DownloadCertButton extends React.Component {
  state = {};
  componentDidMount() {
    this.setCertButtonState(this.props);
  }

  static propTypes = {
    downloadCert: PropTypes.func.isRequired,
    certificateData: PropTypes.object,
    downloadingCert: PropTypes.bool.isRequired,
    showMessageInPopup: PropTypes.bool.isRequired,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    downloadingCert: false,
    showMessageInPopup: false
  };
  getCertButtonProps(props) {
    const { certificateData, downloadCert, downloadingCert } = props;

    if (downloadingCert) return { loading: true };
    if (!certificateData || certificateData.state === "IN_PROGRESS") {
      return {
        onClick: downloadCert
      };
    }

    return {
      href: certificateData.path,
      target: "_blank"
    };
  }

  setCertButtonState(props) {
    const { certificateData, showMessageInPopup, intl } = props;
    if (
      certificateData &&
      certificateData.state === "IN_PROGRESS" &&
      (!this.state.certButtonState || !this.state.certButtonState.disabled)
    ) {
      const buttonProps = this.state.buttonProps;
      const message = intl.formatMessage({ id: "LB_TXT_GENERATING_CERT_WAIT" });
      if (showMessageInPopup) {
        Modal.info({
          title: message,
          onOk() {}
        });
      }
      this.setState({
        certButtonState: {
          disabled: true
        },
        buttonProps: {},
        additionalMessage: !showMessageInPopup ? <div>{message}</div> : ""
      });

      setTimeout(
        (() => {
          this.setState({
            certButtonState: {
              disabled: false
            },
            buttonProps
          });
        }).bind(this),
        120000
      );
    } else {
      this.setState({
        buttonProps: { ...this.getCertButtonProps(props) }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !nextProps.certificateData ||
      deepEqual(nextProps.certificateData, this.props.certificateData)
    )
      return;
    this.setCertButtonState(nextProps);
  }

  render() {
    const classes = this.props.showMessageInPopup ? "marginL10 marginR20 floatR" : "marginT15";
    return (
      <div className={classes}>
        <MtButton
          type="grey"
          key="certificate"
          className="displayIB cursor"
          ghost
          {...this.state.buttonProps}
          {...this.state.certButtonState}
        >
          <div className="floatL F20 marginR8 marginT4" />
          <Icon type="downloadCertificate" />
          <div className="floatL lineHeight28">
            <FormattedMessage id="MSG_DOWNLOAD_CERT" />
          </div>
          <div className="clear" />
        </MtButton>
        {this.state.additionalMessage}
      </div>
    );
  }
}

export default DownloadCertButton;
