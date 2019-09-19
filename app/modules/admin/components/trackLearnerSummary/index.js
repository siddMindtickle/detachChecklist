import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import style from "./index.scss";

export default class TrackLearnerSummary extends Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  state = {
    selectedIndex: 0
  };

  select = ({ type, index }) => {
    this.setState({
      selectedIndex: index
    });
    this.props.onSelect(type);
  };

  render() {
    const { tabs } = this.props;
    const { selectedIndex } = this.state;
    return [
      <div className={style.summaryPanel} key="summaryPanel">
        {tabs.map(({ title, type }, index) => {
          return (
            <div
              key={index}
              onClick={() => this.select({ type, index })}
              className={classnames(style.tabbing, selectedIndex == index ? style.active : "")}
            >
              <div className={style.tabbingElements}>{title}</div>
            </div>
          );
        })}
      </div>
    ];
  }
}
