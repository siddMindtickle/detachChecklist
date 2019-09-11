import React from "react";
import PropTypes from "prop-types";
import TagItem from "../tagItem";
import style from "./index.scss";
import classnames from "classnames";

// import Info from "@components/info";

import { noop } from "@utils";

const SuggestedTags = props => {
  const { tags, onRemove, onSelect } = props;
  return tags.length ? (
    <div className={style.suggestedTagsSection}>
      <div className={style.heading}>Suggested Tags</div>
      {/* <Info content={"Suggested Tags"} className="cwt-infoIcon" /> */}
      <div className={classnames("clearfix", style.suggestedTagsBlock)}>
        {tags.map(tag => {
          return (
            <TagItem
              key={tag.id}
              value={tag.id}
              text={tag.name}
              onRemove={onRemove}
              onSelect={onSelect}
              active={!!tag.selected}
              isSuggested={true}
            />
          );
        })}
      </div>
    </div>
  ) : null;
};

SuggestedTags.defaultProps = {
  onSelect: noop,
  onRemove: noop
};

SuggestedTags.propTypes = {
  tags: PropTypes.array,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func
};

export default SuggestedTags;
