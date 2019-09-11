import React, { Component } from "react";
import PropTypes from "prop-types";

import Info from "@components/info";
import { extractTextContent } from "@app/utils";
import TagItem from "../../components/tagItem";

import classnames from "classnames";

import "./index.scss";

export default class CategoryTags extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };

  render() {
    const { tags, name, description, ...rest } = this.props;
    return (
      <div className="cwt-wrapper-heading">
        <div key={name} className={classnames("marginB10", "clearfix")}>
          <div className="cwt-heading">{name}</div>
          {description && (
            <Info content={extractTextContent(description)} className="cwt-infoIcon" />
          )}
        </div>
        <div key="categoryTags" className="cwt-tagList clearfix">
          {Object.keys(tags).map(id => {
            const tag = tags[id];
            return (
              <TagItem key={id} value={tag.id} text={tag.name} {...rest} active={!!tag.selected} />
            );
          })}
        </div>
      </div>
    );
  }
}
