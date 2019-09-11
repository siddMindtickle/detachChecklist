import React from "react";
import PropTypes from "prop-types";

import style from "./index.scss";

const PublishedChanges = ({ summary }) => {
  return summary.map((content, index) => {
    return (
      <div key={`${content.title}-${index}`} className={style.publishChangesContainer}>
        <div className={style.publishChanges}>
          <div className={style.publishChangesDiv}>
            <div className={style.publishChangesDivHeading}>{content.title}</div>
            <ul className={style.publishChangesDivDesc}>
              {content.changes.length ? (
                content.changes.map((change, index) => {
                  return <li key={index}>{change}</li>;
                })
              ) : (
                <div>No changes.</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  });
};
PublishedChanges.propTypes = {
  summary: PropTypes.array.isRequired
};

export default PublishedChanges;
