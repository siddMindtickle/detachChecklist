import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Routes from "~/modules/TestModule/config/routes";

import Container from "./containers/list/index";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path={Routes.base} component={Container} />
      </Switch>
    );
  }
}

export default App;
