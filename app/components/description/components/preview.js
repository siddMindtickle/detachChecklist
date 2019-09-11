import React from "react";
import PropTypes from "prop-types";

import InnerHTML from "@components/innerHTML";

const DescriptionPreview = ({ content, onEdit }) => {
  return (
    <div>
      <span onClick={onEdit} className="desc_editLink">
        Edit
      </span>
      <div className="clear" />
      <InnerHTML
        id="description_html"
        content={content ? content : "No Description"}
        className="desc_preview"
      />
    </div>
  );
};
DescriptionPreview.propTypes = {
  content: PropTypes.string,
  onEdit: PropTypes.func.isRequired
};

export default DescriptionPreview;
