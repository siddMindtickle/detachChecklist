import React from "react";
import PropTypes from "prop-types";

import TagItem from "../../components/tagItem";
import classnames from "classnames";
import style from "./index.scss";

const AppliedTags = ({ tags, tagsMap, onRemove }) => {
  if (tags.length) {
    return tags.map(id => {
      const tag = tagsMap[id];
      return tag ? (
        <TagItem key={id} text={tag.name} value={id} onRemove={onRemove} active />
      ) : null;
    });
  } else {
    return <div className={classnames(style.noTagsText, "floatL")}>No Tags applied.</div>;
  }
};

AppliedTags.propTypes = {
  tags: PropTypes.array.isRequired,
  tagsMap: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default AppliedTags;
