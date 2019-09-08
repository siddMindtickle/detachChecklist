import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

import { reload } from "@utils";
import Routes from "@config/base.routes";

const PrivateRoute = ({ component: Component, authenticated, render: routeRender, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          Component ? (
            <Component {...props} />
          ) : routeRender ? (
            routeRender(props)
          ) : null
        ) : (
          reload(Routes.base, { replace: true })
          // <Redirect
          //   to={{ pathname: Routes.base, state: { from: props.location } }}
          // />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  authenticated: PropTypes.bool,
  location: PropTypes.object,
  component: PropTypes.node,
  render: PropTypes.func
};

export default PrivateRoute;
