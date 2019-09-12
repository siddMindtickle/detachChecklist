import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import Input from "@components/input";
import Tooltip from "@components/info";
import { BUTTON_TYPES } from "@components/button";
import withButtons from "@hocs/withButtons";

import { deepEqual, isUndefined } from "@utils";

import style from "./index.scss";

class EditableContent extends Component {
  state = {
    editing: false
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    value: PropTypes.string, // value of the input box, if in edit mode
    allowEmpty: PropTypes.bool,
    maxLength: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]), // max length of the editing component
    maxLengthClassName: PropTypes.string,
    placeholder: PropTypes.string, // clickable link to show when the content to be edited can be kept as empty
    editClass: PropTypes.string,
    staticClass: PropTypes.string,
    editComponent: PropTypes.node,
    operationStatus: PropTypes.object
  };

  static defaultProps = {
    placeholder: "Add Content",
    allowEmpty: true,
    operationStatus: {},
    editComponent: Input
  };

  editComponent = withButtons(this.props.editComponent, {
    primaryType: BUTTON_TYPES.PRIMARY_NEW_SM,
    secondaryType: BUTTON_TYPES.DEFAULT_NEW_SM,
    primaryChild: "Save",
    secondaryChild: "Cancel"
  });

  UNSAFE_componentWillReceiveProps(nextProps) {
    const oldOperationStatus = this.props.operationStatus;
    const newOperationStatus = nextProps.operationStatus;
    if (!deepEqual(oldOperationStatus, newOperationStatus)) {
      if (newOperationStatus.hasError || newOperationStatus.loaded) {
        this.toggleEditMode(false);
      }
    }
  }

  toggleEditMode = editing =>
    this.setState(prevState => ({
      editing: isUndefined(editing) ? !prevState.editing : editing
    }));

  renderEditingComponent() {
    const EditComponent = this.editComponent;
    return (
      <EditComponent
        name={this.props.name}
        value={this.props.value}
        ok={this.props.onChange}
        cancel={this.toggleEditMode}
        allowEmpty={this.props.allowEmpty}
        className={style.ecInputContainer}
        componentClassName={classname(style.ecInput, this.props.editClass)}
        placeholder="Add Content"
        maxLength={this.props.maxLength}
        maxLengthClassName={this.props.maxLengthClassName}
      />
    );
  }

  renderStaticComponent() {
    const { value, placeholder } = this.props;
    return value ? (
      <Tooltip
        content="Click to Edit"
        node={
          <div
            onClick={this.toggleEditMode}
            className={classname(style.ecStatic, this.props.staticClass)}
          >
            {value}
          </div>
        }
      />
    ) : (
      <div className="link" onClick={this.toggleEditMode}>
        {placeholder}
      </div>
    );
  }

  render() {
    return this.state.editing ? this.renderEditingComponent() : this.renderStaticComponent();
  }
}

export default EditableContent;
