import React, { Component } from "react";
import PropTypes from "prop-types";
import conditionalConcatenation from "classnames";

import style from "./insightsList.scss";
import { handleQueryStringForApi } from "@utils";

const INSIGHTS_BASE_URL = "/ui/insights/list";

let url = handleQueryStringForApi({
  insightsUrl() {
    return {
      url: INSIGHTS_BASE_URL
    };
  }
});

export default class Insights extends Component {
  static propTypes = {
    moduleId: PropTypes.string.isRequired,
    seriesId: PropTypes.string.isRequired,
    show: PropTypes.bool
  };

  constructor() {
    super();
    this.state = {
      animating: false
    };
  }

  toggleAnimatingStatus = animating => {
    this.setState({ animating });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.props.show) {
      clearTimeout(this.timer);
      this.setState({
        animating: true
      });
      this.timer = setTimeout(() => {
        this.setState({
          animating: false
        });
      }, 350);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { show, ...nextProps } = this.props;
    const className = conditionalConcatenation(style.insightsListWrapper, {
      [style.iframeFullWidth]: show
    });
    const src = conditionalConcatenation({
      [url.insightsUrl({ query: nextProps }).url]: show && !this.state.animating
    });
    return (
      <div className={className}>
        <iframe className={style.frame} src={src} />
      </div>
    );
  }
}
