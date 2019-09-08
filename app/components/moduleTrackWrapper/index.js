import React, { Component } from "react";
import PropTypes from "prop-types";

import emptyStateIconImage from "./assests/images/invite_empty_state.png";
import style from "./index.scss";

const NotPublished = () => {
  return (
    <div className={style.trackWrapperEmptyState}>
      <div className={style.trackWrapperCenterDiv}>
        <div className={style.heading}>
          Before you invite learners, you need to go to Publish tab and publish this module.
        </div>
        <div className={style.subHeading}>
          After you publish the Module, you can invite learners and track their progress here.
        </div>
        <div className={style.emptyStateIcon}>
          <img src={emptyStateIconImage} />
        </div>
      </div>
    </div>
  );
};

export default class TrackWrapper extends Component {
  static propTypes = {
    isPublished: PropTypes.bool.isRequired,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.node]).isRequired
  };
  render() {
    const { component: TrackComponent, ...rest } = this.props;
    return this.props.isPublished ? <TrackComponent {...rest} /> : <NotPublished />;
  }
}
