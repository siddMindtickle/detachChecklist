import React, { Component } from "react";
import PropTypes from "prop-types";

import { deepEqual, convertArrayToObject } from "@utils";

import Button from "@components/button";
import OpenSearch from "@components/openSearch";

import CategoryWithTags from "../../components/categoryWithTags";
import CreateTag from "../../components/createTag";
import SuggestedTags from "../../components/suggestedTags";

import { parseTagsByCatgegory, parseSuggestedTags } from "../../utils";
import "./index.scss";
import TagItem from "../tagItem";

class ChooseTagsFooter extends Component {
  static propTypes = {
    tagsMap: PropTypes.object.isRequired,
    selectedNotAppliedTags: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };
  render() {
    const { selectedNotAppliedTags, tagsMap, onCancel, onSubmit, onRemove } = this.props;
    return (
      <div className="tags-modalFooter">
        <div className="tagsTobeApplied">
          {selectedNotAppliedTags.length ? (
            <span className="floatL">{selectedNotAppliedTags.length} new tags selected</span>
          ) : (
            ``
          )}
          <div className="tagsSelected">
            {selectedNotAppliedTags.map(tagId => {
              const tag = tagsMap[tagId];
              return (
                <TagItem
                  key={tag.id}
                  text={tag.name}
                  value={tag.id}
                  onRemove={onRemove}
                  active={true}
                />
              );
            })}
          </div>
          <div className="tagsApplyBtns">
            <Button name="cancel" type="DefaultSm" className="marginR10" onClick={onCancel}>
              Cancel
            </Button>
            <Button name="applyTags" type="PrimarySm" className="marginR10" onClick={onSubmit}>
              Apply Tags
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

class ChooseTagsBody extends Component {
  static propTypes = {
    canCreateTags: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string,
    suggestedTags: PropTypes.array,
    tags: PropTypes.object.isRequired,
    tagsMap: PropTypes.object.isRequired,
    categoriesMap: PropTypes.object.isRequired,
    selectedTags: PropTypes.object.isRequired,

    onTagSelect: PropTypes.func.isRequired,
    onTagUnselect: PropTypes.func.isRequired,
    onTagCreate: PropTypes.func.isRequired
  };
  static defaultProps = {
    searchQuery: null
  };
  state = {
    showCreateScreen: false
  };
  toggleCreateScreen = (value = false) => {
    this.setState({ showCreateScreen: !!value });
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (!deepEqual(newProps, this.props)) {
      this.setState({ showCreateScreen: false });
    }
  }
  render() {
    const {
      tags,
      categoriesMap,
      tagsMap,
      selectedTags,
      searchQuery,
      onTagCreate,
      onTagSelect,
      onTagUnselect,
      suggestedTags,
      canCreateTags
    } = this.props;
    const { showCreateScreen } = this.state;
    const parsedData = parseTagsByCatgegory({
      tags,
      categoriesMap,
      tagsMap,
      selectedTags
    });
    const parsedSuggestedTags = parseSuggestedTags({
      suggestedTags,
      tagsMap,
      selectedTags
    });

    const availableCategories = Object.keys(parsedData);
    return (
      <React.Fragment>
        {availableCategories.length ? (
          availableCategories.map(categoryId => {
            const categoryDetails = parsedData[categoryId];
            return (
              <CategoryWithTags
                key={categoryId}
                onSelect={onTagSelect}
                onRemove={onTagUnselect}
                name={categoryDetails.name}
                id={categoryId}
                description={categoryDetails.description}
                tags={categoryDetails.tags || []}
              />
            );
          })
        ) : !showCreateScreen ? (
          canCreateTags && (
            <span className="link" onClick={() => this.toggleCreateScreen(true)}>
              Create New Tag &quot;
              {searchQuery}
              &quot;
            </span>
          )
        ) : (
          <CreateTag
            tagName={searchQuery}
            categories={categoriesMap}
            onSubmit={onTagCreate}
            onCancel={this.toggleCreateScreen}
          />
        )}
        <SuggestedTags tags={parsedSuggestedTags} onSelect={onTagSelect} onRemove={onTagUnselect} />
      </React.Fragment>
    );
  }
}

export default class ChooseTags extends Component {
  static propTypes = {
    apply: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,

    suggestedTags: PropTypes.array.isRequired,
    canCreateTags: PropTypes.bool.isRequired,
    categoriesMap: PropTypes.object.isRequired,
    tagsMap: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    appliedTags: PropTypes.object.isRequired
  };

  state = {
    selectedTags: this.props.appliedTags,
    // Tags which are currently not applied.
    selectedNotAppliedTags: [],
    searchQuery: null
  };

  updateSelection = (id, value) => {
    const { selectedNotAppliedTags: oldSelectedNotAppliedTags } = this.state;
    let selectedNotAppliedTags;
    const { appliedTags } = this.props;

    if (!appliedTags[id]) {
      if (value) {
        selectedNotAppliedTags = oldSelectedNotAppliedTags.union([id]);
      } else {
        selectedNotAppliedTags = oldSelectedNotAppliedTags.subtract([id]);
      }
    }
    const selectedTags = Object.assign({}, this.state.selectedTags, {
      [id]: value
    });
    this.setState({
      selectedTags,
      selectedNotAppliedTags
    });
  };

  onSelect = id => {
    id && this.updateSelection(id, true);
  };

  onRemove = id => {
    id && this.updateSelection(id, false);
  };

  search = value => {
    this.setState({ searchQuery: value });
    this.props.search(value);
  };

  apply = () => {
    const { apply } = this.props;
    const { selectedTags } = this.state;
    const selectedTagIds = Object.keys(selectedTags).filter(tagId => selectedTags[tagId]);
    apply(selectedTagIds);
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (!deepEqual(newProps.tagsMap, this.props.tagsMap)) {
      let newTags = Object.keys(newProps.tagsMap).subtract(Object.keys(this.props.tagsMap));
      newTags = convertArrayToObject(newTags);
      this.setState({
        selectedTags: {
          ...newProps.appliedTags,
          ...newTags,
          ...this.state.selectedTags
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedNotAppliedTags: oldSelectedNotAppliedTags } = prevState;
    if (!deepEqual(this.props.tagsMap, prevProps.tagsMap)) {
      let newTags = Object.keys(this.props.tagsMap).subtract(Object.keys(prevProps.tagsMap));
      const selectedNotAppliedTags = oldSelectedNotAppliedTags.union(newTags);
      this.setState({
        selectedNotAppliedTags
      });
    }
  }

  render() {
    const { selectedTags, searchQuery, selectedNotAppliedTags } = this.state;
    const {
      cancel,
      create,
      tags,
      tagsMap,
      categoriesMap,
      suggestedTags,
      canCreateTags
    } = this.props;

    const placeholder = canCreateTags ? "Search or create a Tag" : "Search a tag";

    return (
      <div className="tags-modalbody">
        <OpenSearch placeholder={placeholder} close={true} onSearch={this.search} />
        <div className="tagsScroll">
          <ChooseTagsBody
            canCreateTags={canCreateTags}
            searchQuery={searchQuery}
            tags={tags}
            selectedTags={selectedTags}
            tagsMap={tagsMap}
            categoriesMap={categoriesMap}
            onTagCreate={create}
            onTagSelect={this.onSelect}
            onTagUnselect={this.onRemove}
            suggestedTags={suggestedTags}
          />
        </div>
        <div>
          <ChooseTagsFooter
            tagsMap={tagsMap}
            selectedNotAppliedTags={selectedNotAppliedTags}
            onRemove={this.onRemove}
            onSubmit={this.apply}
            onCancel={cancel}
          />
        </div>
      </div>
    );
  }
}
