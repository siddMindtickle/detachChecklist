import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
//import NotFound from "@mt-ui-core/components/notFound";
// import { showLoader } from "@mt-ui-core/utils/loader";
import Test from "../Test";
//import Routes from "~/config/Routes";

//import TestModule from "~/modules/TestModule";

class App extends Component {
  componentDidMount() {
    // showLoader();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Test} />
        {/*<Route exact path={Routes.notFound} component={NotFound} />*/}
        {/*<Route path={Routes.test} component={TestModule} />*/}
      </Switch>
    );
  }
}

export default App;
