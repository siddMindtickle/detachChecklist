import React, { Component } from "react";
import PropTypes from "prop-types";
import { isAdminSite } from "mt-ui-core/utils";
import withUserAuth from "mt-ui-core/hocs/withUserAuth";
import { asyncComponent as GetAsyncComponent } from "mt-ui-core/core/helpers";
import PrivateRoute from "@components/privateRoute";
import Routes, { ROUTES } from "@config/Routes";

const Admin = GetAsyncComponent(() =>
  import(/* webpackChunkName: "checklist-admin" */ "@modules/admin")
);

const Learner = GetAsyncComponent(() =>
  import(/* webpackChunkName: "checklist-learner" */ "@modules/learner")
);

const AdminHeader = GetAsyncComponent(() =>
  import(/* webpackChunkName: "adminHeader", webpackPrefetch: true */ "mt-ui-core/components/AdminHeader")
);

class App extends Component {
  static propTypes = {
    userAuth: PropTypes.shape({
      isLoggedIn: PropTypes.bool
    }),
    logout: PropTypes.func
  };

  static defaultProps = {
    isLoggedIn: false
  };

  render() {
    const { userAuth = {}, logout } = this.props;
    const { isLoggedIn } = userAuth;
    if (isAdminSite()) {
      return (
        <>
          <AdminHeader userAuth={userAuth} logout={logout} />
          <PrivateRoute
            path={Routes[ROUTES.CHECKLIST]}
            render={props => <Admin props={props} pageType="" />}
            authenticated={isLoggedIn}
          />
        </>
      );
    }
    return (
      <PrivateRoute
        path={Routes[ROUTES.CHECKLIST]}
        component={Learner}
        style={{ height: "100%" }}
        authenticated={isLoggedIn}
      />
    );
  }
}

let component = withUserAuth(App);

export default component;
