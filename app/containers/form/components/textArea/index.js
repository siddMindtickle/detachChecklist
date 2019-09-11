import React, { Component } from "react";
import PropTypes from "prop-types";

import style from "./index.scss";

import withValidation from "../../utils/withValidation";

class TextArea extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    form: PropTypes.object,
    update: PropTypes.func.isRequired,
    counter: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  };

  static defaultProps = {
    form: {},
    className: "",
    counter: false
  };

  onBlur = event => {
    this.props.update({
      value: event.target.value,
      errors: this.props.form.state[this.props.name].errors
    });
  };

  render() {
    return [
      <textarea
        key="textArea"
        name={this.props.name}
        placeholder={this.props.placeholder}
        className={(style.textArea, this.props.className)}
        onBlur={this.onBlur}
      />,
      <span className={style.counterStyle} key="counter">
        {this.props.counter}
      </span>
    ];
  }
}

export default withValidation(TextArea);
