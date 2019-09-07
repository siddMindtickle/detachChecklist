import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { injectReducer, injectSaga, getActions } from "@mt-ui-core/core/helpers";
import Loader from "@mt-ui-components/Loader";

import { GET_DATA } from "../../actionTypes";
import saga from "./saga";
import reducer from "../../reducers/listReducer";
import View from "~/modules/TestModule/components/View";

class Container extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    getData: PropTypes.func.isRequired,
    data: PropTypes.object
  };

  static defaultProps = {
    loaded: false,
    isLoading: true
  };

  componentDidMount() {
    const { loaded, getData } = this.props;
    !loaded && getData();
  }

  render() {
    const { loaded, isLoading, data } = this.props;
    return [loaded && <View key="test" data={data} />, isLoading && <Loader key="loader" />];
  }
}

const mapStateToProps = state => {
  const { loaded, isLoading, hasError, ...data } = state.test;

  return {
    loaded,
    isLoading,
    hasError,
    data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: data => {
      dispatch(getActions(GET_DATA)(data));
    }
    // manipulateData: data => {
    //   dispatch(getActions(MANIPULATE_DATA)(data));
    // }
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "test", reducer });
const withSaga = injectSaga({ name: "test", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Container);
