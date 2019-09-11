import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./index.scss";

const ViewThumbnail = ({ className, thumbnail, onEdit }) => {
  return (
    <div className={classnames("boxStyle", className)}>
      <div className="thumbnail-headerSection">
        <div className="thumbnail-heading">Thumbnail</div>
        <div className={classnames("thumbnail-editLink", "link")} onClick={onEdit}>
          Edit
        </div>
      </div>
      <div className="thumbnail-section">
        <div className="thumbnail-noTagsText">
          <img src={thumbnail.thumbUrl} />
        </div>
      </div>
    </div>
  );
};

ViewThumbnail.propTypes = {
  className: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  thumbnail: PropTypes.object.isRequired
};
export default ViewThumbnail;
