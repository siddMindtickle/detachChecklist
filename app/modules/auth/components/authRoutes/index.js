import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";

//import { asyncComponent as GetAsyncComponent } from "@core/helpers";

import PrivateRoute from "@components/privateRoute";

import Routes, { ROUTES } from "../../config/routes";

import { hasModuleAccess } from "../../utils";

import { withHeader } from "../../utils/hoc";

const Checklist = withHeader();
/*GetAsyncComponent(() =>
    import(/!* webpackChunkName: "checklist" *!/ "../../../checklist")
  )*/

const ILT = withHeader();
//GetAsyncComponent(() => import(/* webpackChunkName: "ilt" */ "../../../ilt"))

const AutomationRules = withHeader();
/* GetAsyncComponent(() =>
    import(/!* webpackChunkName: "automationRules" *!/ "../../../rules")
  )*/

export default class AuthRoutes extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    auth: PropTypes.object,
    headerProps: PropTypes.object
  };

  hasAccess = route => hasModuleAccess(route, this.props.auth);

  render() {
    const { headerProps } = this.props;
    return (
      <Switch>
        <PrivateRoute
          path={Routes[ROUTES.CHECKLIST]}
          render={props => <Checklist props={props} headerProps={headerProps} pageType="" />}
          authenticated={this.props.isLoggedIn}
        />
        <PrivateRoute
          path={Routes[ROUTES.ILT]}
          render={props => <ILT props={props} headerProps={headerProps} />}
          authenticated={this.props.isLoggedIn}
        />
        <PrivateRoute
          path={Routes[ROUTES.RULES]}
          render={props => <AutomationRules props={props} headerProps={headerProps} />}
          authenticated={this.props.isLoggedIn && this.hasAccess(ROUTES.RULES)}
        />
      </Switch>
    );
  }
}
