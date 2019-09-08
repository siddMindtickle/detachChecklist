import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Icon from "@components/icon";

import InsightsList from "./insightsList";
import styles from "./insights.scss";

const PAGE_CONTEXT = ["Module", "Series"].join(",");

class ViewInsights extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    moduleId: PropTypes.string,
    seriesId: PropTypes.string
  };
  static defaultProps = {
    label: <Icon type="smartInsights" />
  };

  constructor() {
    super();
    this.state = {
      showInsights: false
    };
  }

  handleInsights = ({ data } = {}) => {
    const { function: func } = data["@@insights"] || {};
    switch (func) {
      case "close":
        this.toggleInsights(true);
    }
  };

  componentDidMount() {
    window.addEventListener("message", this.handleInsights);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handleInsights);
  }

  toggleInsights(hide = false) {
    this.setState(prevState => {
      const showInsights = hide ? false : !prevState.showInsights;
      return {
        ...prevState,
        showInsights
      };
    });
  }

  handleClick = () => {
    this.toggleInsights();
  };

  render() {
    return (
      <Fragment>
        <div
          className={classnames(this.props.className, styles.viewInsights)}
          onClick={this.handleClick}
        >
          {this.props.label}
        </div>
        <InsightsList
          show={this.state.showInsights}
          moduleId={this.props.moduleId}
          seriesId={this.props.seriesId}
          url={encodeURIComponent(location.href)}
          pageContext={PAGE_CONTEXT}
        />
      </Fragment>
    );
  }
}

export default ViewInsights;
