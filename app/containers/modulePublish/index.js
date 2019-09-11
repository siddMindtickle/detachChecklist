import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

import Loader from "@components/loader";
import { LIFECYCLE_STAGES } from "@config/env.config";
import { getLifecycleStageUrl, noop, deepEqual } from "@utils";
import { getActions, injectSaga, injectReducer } from "@core/helpers";
import showAlert from "@utils/alert";
import { errorToast as ErrorToast } from "@utils/toast";

import PublishBody from "./components/publishBody";

import saga from "./saga";
import {
  LOAD_DATA,
  GET_PUBLISH_DATA,
  GET_PROFILE_KEY_DATA,
  MANIPULATE_PUBLISH_DATA,
  PUBLISH_DATA,
  UPDATE_SEARCH_LEARNERS
} from "./actionTypes";

import reducer from "./reducer";

import { getNotificationMessage, PUBLISH_FAIL_MESSAGE } from "./config/constants";

class PublishDraft extends Component {
  static propTypes = {
    loadData: PropTypes.func,
    publishData: PropTypes.func,
    moduleType: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    actions: PropTypes.object,
    publish: PropTypes.object,
    moduleName: PropTypes.string,
    baseUrl: PropTypes.string,
    onPublish: PropTypes.func,
    stageRoutes: PropTypes.object.isRequired,
    moduleId: PropTypes.string,
    companyId: PropTypes.string,
    seriesId: PropTypes.string,
    inviteTabName: PropTypes.string,
    mappedSeries: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    publish: {},
    onPublish: noop,
    inviteTabName: "Invite & Track"
  };

  state = {
    isPublishing: false,
    isPublished: false
  };

  componentDidMount() {
    const { moduleId, seriesId, mappedSeries, companyId, moduleType } = this.props;
    const params = { moduleId, seriesId, mappedSeries, companyId, moduleType };
    this.props.loadData(params);
  }

  componentWillReceiveProps(nextProps) {
    const oldPublishData = this.props.publish.publish || {};
    const newPublishData = nextProps.publish.publish || {};
    if (!deepEqual(newPublishData, oldPublishData) && newPublishData.loaded) {
      if (newPublishData.hasError) {
        this.setState({
          isPublishing: false,
          isPublished: false
        });
        ErrorToast({ message: PUBLISH_FAIL_MESSAGE });
      } else if (newPublishData.loaded !== oldPublishData.loaded) {
        this.setState({
          isPublishing: false,
          isPublished: true
        });
        this.props.onPublish();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isPublished } = this.state;
    if (isPublished && prevState.isPublished !== isPublished) {
      this.renderPublishedModal();
    }
  }

  handlePublish = (options = {}) => {
    this.props.publishData(options);
    this.setState({ isPublishing: true });
  };

  goToInvite = () => {
    const { baseUrl, stageRoutes: routes } = this.props;
    this.props.history.push(
      getLifecycleStageUrl({
        baseUrl,
        stage: LIFECYCLE_STAGES.INVITE,
        routes
      })
    );
  };

  renderPublishedBody() {
    const { publish: { data: { numOfSelectedLearners, notify } = {} } = {} } = this.props.publish;
    const { moduleType, inviteTabName } = this.props;
    return (
      <div className="innerBody">
        <div className={classnames("pub-success")}>
          <div className={classnames("pub-success--message", "customMessageStyle", "marginB30")}>
            {moduleType} has been successfully published.
            {notify ? (
              <div>
                <span>{getNotificationMessage(numOfSelectedLearners)}</span>
                <b>{inviteTabName}</b>
                <span> tab.</span>
              </div>
            ) : (
              <div>
                <span>Start inviting Learners from </span>
                <b>{inviteTabName}</b>
                <span> tab.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderPublishingLoader() {
    return <Loader loadingMessage="Publishing..." />;
  }

  renderPublishedModal() {
    showAlert(this.renderPublishedBody(), {
      id: "published",
      okBtnText: `Go to ${this.props.inviteTabName}`,
      callback: this.goToInvite
    });
    this;
  }

  renderBody() {
    if (this.state.isPublished) return null;
    if (this.state.isPublishing) return this.renderPublishingLoader();
    const {
      publish: { count, ...data },
      moduleType,
      mappedSeries
    } = this.props;
    return (
      <PublishBody
        count={count}
        data={data}
        seriesName={this.props.moduleName}
        actions={this.props.actions}
        onPublish={this.handlePublish}
        onCheck={this.handleClick}
        moduleType={moduleType}
        mappedSeries={mappedSeries}
      />
    );
  }

  render() {
    const { count: { loaded } = {} } = this.props.publish;
    return <div>{loaded ? this.renderBody() : <Loader />}</div>;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadData: params => dispatch(getActions(LOAD_DATA)(params)),
    publishData: options => dispatch(getActions(PUBLISH_DATA)(options)),
    actions: {
      getProfileKeyData: ({ profileField }) =>
        dispatch(getActions(GET_PROFILE_KEY_DATA)({ profileField })),
      getData: options => dispatch(getActions(GET_PUBLISH_DATA)(options)),
      manipulateData: data => dispatch(getActions(MANIPULATE_PUBLISH_DATA)(data)),
      resetData: () => {
        const { RESET } = getActions({
          name: GET_PUBLISH_DATA,
          options: { async: true }
        });
        dispatch(getActions(UPDATE_SEARCH_LEARNERS)({}, { replace: true, reset: true }));
        dispatch(RESET());
      },
      dispatchAction: action => dispatch(action)
    }
  };
};

const mapStateToProps = state => {
  return {
    publish: state.publishDraft
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "publishDraft", reducer });
const withSaga = injectSaga({ name: "publishDraft", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter
)(PublishDraft);
