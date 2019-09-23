import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col } from "antd";
import PropTypes from "prop-types";
//import classNames from "classnames";

//import { getActions } from "@core/helpers";
import { getCookieHeader } from "@utils/iframeAuthHandling";

// import UserHeaderIcon from "@components/userIcon";
// import { reload } from "@utils";

//import style from "./index.scss";

const { Header } = Layout;
class EntityHeader extends Component {
  static propTypes = {
    learner: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    series: PropTypes.object.isRequired,
    entityName: PropTypes.string.isRequired,
    entityIcon: PropTypes.node.isRequired
  };

  render() {
    const gotoSeries = () => {
      const iframeCookie = getCookieHeader();
      let url = "";
      if (iframeCookie.value) {
        url += `/?${iframeCookie.key}=${encodeURIComponent(iframeCookie.value)}`;
      }
      url += `/#/courses/series/${this.props.series.id}?series=${this.props.series.id}`;
      window.location = url;
    };

    const gotoDashboard = () => {
      const iframeCookie = getCookieHeader();
      window.location = iframeCookie.value
        ? `/?${iframeCookie.key}=${encodeURIComponent(iframeCookie.value)}`
        : "/";
    };
    return (
      <Header
        style={{
          padding: "0 0px",
          borderBottom: "1px solid #eee",
          height: "auto",
          color: "#000"
        }}
      >
        <Row>
          <Col xs={1} sm={10} md={8} lg={10} xl={8} xxl={8}>
            <div className="lineHeight36" style={{ padding: "10px 12px" }}>
              <div
                className="floatL F12 icon-ddArrowLeft paddingT12 paddingR8 cursor"
                onClick={gotoSeries}
              />
              <Row>
                <Col xs={0} sm={20} md={20} lg={22} xl={22} xxl={22}>
                  <div className="floatL cursor paddingR7" onClick={gotoDashboard}>
                    Home
                  </div>
                  <div className="floatL">|</div>
                  <div
                    className="floatL F14 icon-seriesOutline marginT12 paddingR7 paddingL7 cursor"
                    onClick={gotoSeries}
                  />
                  <div className="ellipsis">
                    <span className="cursor" onClick={gotoSeries}>
                      {this.props.series.name}
                    </span>
                  </div>
                  <div className="clear" />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={23} sm={14} md={16} lg={14} xl={16} xxl={16}>
            <Row style={{ width: "100%" }}>
              <Col xs={10} sm={10} md={12} lg={10} xl={12} xxl={12}>
                <div
                  className="textalign_C F13 lineHeight36 ellipsis"
                  style={{ padding: "12px 10px" }}
                >
                  {this.props.entityIcon}
                  <div className="displayIB marginL10">{this.props.entityName}</div>
                </div>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={12} xxl={12}>
                {/* <div
                  className="floatR F13 lineHeight36 displayIF"
                  style={{ padding: "12px 15px 12px 0" }}
                >
                  <div className="displayIB profilePicArea cursor">
                    <UserHeaderIcon
                      user={this.props.user}
                      logout={this.props.logout}
                    />
                  </div>
                  <div className="displayF marginL10 MT_Orange">
                    <div className="icon-halfStar F16 marginT10 marginR2" />
                    <div className="F20">
                      {this.props.learner.score.value / 100}
                    </div>
                  </div>
                </div>
                <div className="clear" /> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    );
  }
}

const mapDispatchToProps = () => {
  return {};
};

const mapStateToProps = state => {
  return {
    user: state.auth.login.data.user,
    learner: state.auth.login.data.learner
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EntityHeader);
