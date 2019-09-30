import React, { Component } from "react";
//import { Route, Switch } from "react-router-dom";
//import Routes, { ROUTES } from "~/config/Routes";
//import { withHeader } from "../../modules/auth/utils/hoc";

//import { withHeader } from "../utils/hoc";
import PropTypes from "prop-types";
import { Switch, withRouter } from "react-router-dom";
import { isAdminSite } from "mt-ui-core/utils";
import withUserAuth from "mt-ui-core/hocs/withUserAuth";
import { asyncComponent as GetAsyncComponent } from "mt-ui-core/core/helpers";
import PrivateRoute from "@components/privateRoute";
import Routes, { ROUTES } from "@config/Routes";

const Admin = GetAsyncComponent(() => import(/* webpackChunkName: "checklist" */ "@modules/admin"));

const Learner = GetAsyncComponent(() =>
  import(/* webpackChunkName: "checklist" */ "@modules/learner")
);

const AdminHeader = GetAsyncComponent(() =>
  import(/* webpackChunkName: "coaching-AdminHeader", webpackPrefetch: true */ "mt-ui-core/components/AdminHeader")
);

class App extends Component {
  static propTypes = {
    userAuth: PropTypes.shape({
      isLoggedIn: PropTypes.bool
    }),
    logout: PropTypes.func,

    location: PropTypes.object
  };

  static defaultProps = {
    isLoggedIn: false
  };

  render() {
    const { userAuth = {}, logout } = this.props;
    const { isLoggedIn } = userAuth;
    return (
      <React.Fragment>
        {isAdminSite() ? (
          <div>
            <AdminHeader userAuth={userAuth} logout={logout} />
            <Switch>
              <PrivateRoute
                path={Routes[ROUTES.CHECKLIST]}
                render={props => <Admin props={props} pageType="" />}
                authenticated={isLoggedIn}
              />
            </Switch>
          </div>
        ) : (
          <Switch>
            <PrivateRoute
              path={Routes[ROUTES.CHECKLIST]}
              component={Learner}
              style={{ height: "100%" }}
              authenticated={isLoggedIn}
            />
          </Switch>
        )}
      </React.Fragment>
    );
  }
}

let component = withUserAuth(withRouter(App));

export default component;
