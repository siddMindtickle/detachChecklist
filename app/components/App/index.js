import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
// import { showLoader } from "@mt-ui-core/utils/loader";
import Auth from "~/modules/auth";
import Routes from "~/config/Routes";

class App extends Component {
  componentDidMount() {
    // showLoader();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Auth} />
        <Route path={Routes.test} component={Auth} />
      </Switch>
    );
  }
}

export default App;
