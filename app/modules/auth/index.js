import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { injectReducer, injectSaga, getActions } from "@core/helpers";
import { hideLoader } from "@utils/loader";
import { isUndefined } from "@utils";
import { errorToast as ErrorToast } from "@utils/toast";
import { DISABLE_TRACKING } from "@config/actionTypes.global";
import reducer from "./reducer";
import saga from "./saga";
import { AUTH, LOGOUT } from "./actionTypes";
import { getHeaderLinksByPermissions as getHeaderLinks, getActiveTab } from "./utils";

import AuthRoutes from "./components/authRoutes";
import GET_ERROR_MESSAGES from "./config/error.messages";

class Auth extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    error: PropTypes.object,
    auth: PropTypes.object,
    location: PropTypes.object,
    logoutStatus: PropTypes.object,
    logout: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    stopTracking: PropTypes.func.isRequired
  };

  static defaultProps = {
    auth: {},
    logoutStatus: {}
  };

  getRouting = () => {
    let { auth, isLoggedIn, logout, location } = this.props;

    if (isUndefined(isLoggedIn)) return;

    const headerProps = {
      ...auth,
      accessLinks: getHeaderLinks(auth),
      activeTab: getActiveTab({ location }),
      logout: logout
    };

    return (
      <AuthRoutes key="routes" headerProps={headerProps} isLoggedIn={isLoggedIn} auth={auth} />
    );
  };

  componentWillReceiveProps(nextProps) {
    const {
      logoutStatus: { loaded, hasError, error = {} }
    } = nextProps;
    const {
      logoutStatus: { loaded: oldLoaded }
    } = this.props;
    if (oldLoaded !== loaded && loaded && hasError) {
      ErrorToast({ message: GET_ERROR_MESSAGES(error) });
    }
  }

  componentDidUpdate() {
    const { loaded, hasError, stopTracking, auth: { disableTracking } = {} } = this.props;
    if (loaded) {
      hideLoader();
      !hasError && disableTracking && stopTracking();
    }
  }

  componentDidMount() {
    !this.props.loaded && this.props.getData();
  }

  render() {
    return <div>{this.getRouting()}</div>;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getData: () => dispatch(getActions(AUTH)({}, {})),
    stopTracking: () => dispatch(getActions(DISABLE_TRACKING)()),
    logout: () => dispatch(getActions(LOGOUT)())
  };
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    loaded: state.auth.loaded,
    isLoading: state.auth.isLoading,
    hasError: state.auth.hasError,
    error: state.auth.error,
    auth: state.auth.data,
    logoutStatus: state.auth.logout
  };
};

const withReducer = injectReducer({
  name: "auth",
  reducer: reducer
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga({ name: "auth", saga: saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect
)(Auth);
