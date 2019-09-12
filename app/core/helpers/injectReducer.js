import React, { Component } from "react";
import PropTypes from "prop-types";
import injectReducer, { ejectReducer, injectMultipleReducer } from "./reducerInjector";

export default reducers => WrappedComponent => {
  class InjectReducer extends Component {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    UNSAFE_componentWillMount() {
      let injector;
      if (Array.isArray(reducers)) {
        injector = injectMultipleReducer;
      } else {
        injector = injectReducer;
      }
      injector(this.context.store, reducers);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return InjectReducer;
};

export const ejector = reducers => WrappedComponent => {
  class EjectReducer extends Component {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    UNSAFE_componentWillMount() {
      ejectReducer(this.context.store, reducers);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return EjectReducer;
};
