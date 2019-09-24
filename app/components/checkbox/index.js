import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Icon from "@mindtickle/mt-ui-components/Icon";
import "./index.scss";
export default class checkbox extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func
  };

  state = {
    checked: this.props.checked
  };

  // onClick = event => {
  //   event.stopPropagation();
  //   const isChecked = !this.state.checked;
  //   this.setState({ checked: isChecked });
  //   this.props.onClick(isChecked);
  // };

  render() {
    const { checked, className, onClick, label } = this.props;
    return (
      <div className={classnames(className, "checkboxWrapper")} onClick={onClick}>
        <div className={classnames("checkbox", { checked })}>
          {/* <div className={classnames({checked})}> */}
          <div className={classnames("checkboxOff")}>
            <Icon type="checkboxOff" />
          </div>
          <div className={classnames("checkboxOn")}>
            <Icon type="checkboxOn" />
          </div>
        </div>
        <div className="labelText">{label}</div>
      </div>
    );
  }
}
