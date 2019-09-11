import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "@components/icon";
import Input from "@components/input";
import Dropdown from "@components/dropdown";
import Button from "@components/button";
import "./index.scss";

export default class CreateTag extends Component {
  static propTypes = {
    tagName: PropTypes.string.isRequired,
    categories: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };
  state = {
    categoryId: null,
    tagName: this.props.tagName
  };
  getCategoryOptions = () => {
    const { categories } = this.props;
    return Object.keys(categories).map(id => {
      return {
        text: categories[id].name,
        value: id
      };
    });
  };
  onTagNameChange = event => {
    this.setState({ tagName: event.target.value });
  };
  onCategorySelect = value => {
    this.setState({ categoryId: value });
  };
  render() {
    const { tagName, categoryId } = this.state;
    const { onSubmit, onCancel } = this.props;
    const canSubmit = tagName && categoryId;
    const options = this.getCategoryOptions() || [];
    return [
      <div key="createTag" className="createTag">
        <Input
          value={tagName}
          name="tagName"
          onChange={this.onTagNameChange}
          className="createTag-input"
        />
        <Dropdown
          id="tagCategories"
          options={options}
          setTitle={true}
          title="Choose Category"
          onSelect={this.onCategorySelect}
          className="createTag-dropdown"
          defaultOpen={true}
        />
        <Button
          name="createTag"
          type="PrimaryRoundBtn"
          className="marginL10"
          disabled={!canSubmit}
          onClick={() => {
            onSubmit({ categoryId, tagName });
          }}
        >
          <Icon type="tick" />
        </Button>
        <Button
          name="createTag"
          type="DefaultRoundBtn"
          className="marginL5"
          onClick={() => onCancel()}
        >
          <Icon type="close" />
        </Button>
      </div>
    ];
  }
}
