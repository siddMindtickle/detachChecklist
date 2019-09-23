import React from "react";
import { Input } from "antd";
import PropTypes from "prop-types";
import debounce from "throttle-debounce/debounce";

const Search = Input.Search;

class MtSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputCallback = debounce(500, props.onChange);
  }

  inputCallbackDelayed = e => {
    e.persist();
    this.inputCallback(e);
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired
  };

  render() {
    const props = {
      ...this.props,
      onChange: this.inputCallbackDelayed
    };
    return <Search {...props} />;
  }
}

export default MtSearchInput;
