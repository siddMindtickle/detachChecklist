import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { isUndefined } from "@utils";

import Icon from "@components/icon";
import "./index.scss";

const noop = () => undefined;

export default class TagItem extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onSelect: PropTypes.func,
    onRemove: PropTypes.func,
    active: PropTypes.bool,
    isSuggested: PropTypes.bool
  };

  static defaultProps = {
    onRemove: noop,
    onSelect: noop,
    isSuggested: false
  };

  state = {
    selected: false
  };

  makeControlled = value => {
    this.setState({ selected: value });
  };

  onSelect = () => {
    const { onSelect, value, active } = this.props;
    onSelect(value);
    isUndefined(active) && this.makeControlled(true);
  };

  onRemove = event => {
    const { onRemove, value, active } = this.props;
    event.stopPropagation();
    onRemove(value);
    isUndefined(active) && this.makeControlled(false);
  };

  render() {
    const { text, active, isSuggested } = this.props;
    const selected = active || this.state.selected;
    return (
      <div className={classnames("tagItem-tag", selected && "selected")} onClick={this.onSelect}>
        <div
          className={classnames("tagItem-tagname", isSuggested && "tagItem-suggetsed-tagname")}
          title={text}
        >
          {text}
        </div>
        {selected && <Icon type="close" className="icon" onClick={this.onRemove} />}
      </div>
    );
  }
}
