import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";

import { noop } from "@utils";

import UpdateBtns from "./updateBtns";
import Toolbar from "./toolbar";
import { FORMATS } from "../constants";

export default class Editor extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    helpers: PropTypes.object.isRequired,
    showButtons: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    availableLength: PropTypes.number.isRequired,
    onMount: PropTypes.func
  };
  static defaultProps = {
    onMount: noop
  };

  onChange = value => {
    this.quillRef && this.props.onChange(value, this.quillRef.editor);
  };
  componentDidMount() {
    if (this.quillRef) this.props.onMount(this.props.value, this.quillRef.getEditor());
  }

  render() {
    const { showButtons, helpers, value, availableLength, id } = this.props;
    const toolbarId = `${id}-toolbar`;
    return (
      <div className="mt-quill-editor">
        <Toolbar id={toolbarId} />
        <ReactQuill
          ref={el => {
            this.quillRef = el;
          }}
          value={value}
          onChange={this.onChange}
          bounds=".mt-quill-editor"
          modules={{
            toolbar: {
              container: `#${toolbarId}`
            }
          }}
          formats={FORMATS}
        />
        <span className="customLength">{availableLength}</span>
        {showButtons && <UpdateBtns {...helpers} />}
        <span />
      </div>
    );
  }
}
