import React from "react";

import emptyStateIconImage from "../../images/invite_empty_state.png";
import style from "./index.scss";

const TrackNoInvitedLearners = () => {
  return (
    <div className={style.trackMultiSelectorWrapperEmptyState}>
      <div className={style.trackMultiSelectorCenterDiv}>
        <div className={style.heading}>Start inviting Learners.</div>
        <div className={style.subHeading}>
          Once you invite Learners, their progress can be tracked here.
        </div>
        <div className={style.emptyStateIcon}>
          <img src={emptyStateIconImage} />
        </div>
      </div>
    </div>
  );
};

export default TrackNoInvitedLearners;
