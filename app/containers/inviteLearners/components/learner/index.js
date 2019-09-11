import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "@components/icon";
import Info from "@components/info";
import style from "./index.scss";
import classnames from "classnames";

export default class Learner extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    errors: PropTypes.array,
    email: PropTypes.string,
    profilePic: PropTypes.string,
    remove: PropTypes.func,
    moduleRelevanceCell: PropTypes.node
  };

  static defaultProps = {
    errors: []
  };

  renderError = (error, index) => (
    <div key={`${this.props.id}-${index}`} className={style.error}>
      {error}
    </div>
  );

  componentWillMount() {
    this.removeLearner = () => this.props.remove(this.props.id);
    if (this.props.errors.length) {
      this.errors = this.props.errors.map(this.renderError);
    }
  }

  render() {
    const { errors, profilePic, email, moduleRelevanceCell } = this.props;
    const numOfErrors = errors.length;
    return (
      <div
        className={classnames(style.newLearner, {
          [style.hasErrors]: !!numOfErrors
        })}
      >
        {
          <span className={style.learnerPicHolder}>
            {profilePic ? (
              <img src={profilePic} />
            ) : (
              <Icon type="userProfile" className={style.userProfileIcon} />
            )}
          </span>
        }
        <span className={style.learner_emailText}>{email}</span>
        <div className={style.moduleRelevanceContainer}>{moduleRelevanceCell}</div>
        <Icon type="close" className={style.closeIcon} onClick={this.removeLearner} />
        {numOfErrors ? (
          <div className={classnames("floatR", style.learner_errorStyle)}>
            {numOfErrors > 1 ? (
              <Info node={`${errors.length} errors`} content={this.errors} />
            ) : (
              <span>{errors[0]}</span>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
