import React from "react";
import PropTypes from "prop-types";

import getInjectors from "./sagaInjector";

export default ({ name, saga, mode }) => WrappedComponent => {
  class InjectSaga extends React.Component {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    componentWillMount() {
      const { injectSaga } = this.injectors;

      injectSaga(name, { saga, mode }, this.props);
    }

    componentWillUnmount() {
      // const { ejectSaga } = this.injectors;
      // ejectSaga(name);
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return InjectSaga;
};
