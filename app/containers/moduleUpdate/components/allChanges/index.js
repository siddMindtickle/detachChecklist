import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";

import Icon from "@components/icon";

import PublishedChanges from "../../components/publishedChanges";
import UnpublishedChanges from "../../components/unpublishedChanges";
import { getPublishVersionUrl, getLatestVersion } from "../../utils";

import { DRAFT_VERSION_DETAILS, GET_TITLE, GET_VERSION_DISPLAY_NAME } from "../../config/constants";

const PublishHeading = ({ title }) => {
  return (
    <div key="heading" className={"publishHeading"}>
      {title}
    </div>
  );
};
PublishHeading.propTypes = {
  title: PropTypes.string.isRequired
};

class Content extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    todos: PropTypes.number.isRequired,
    baseUrl: PropTypes.string.isRequired,
    publishSummary: PropTypes.object,
    publishHistory: PropTypes.array,
    moduleType: PropTypes.string,
    hasUnpublishedChanges: PropTypes.bool,
    showInviteOptions: PropTypes.bool.isRequired,
    defaultInviteOption: PropTypes.string.isRequired,
    showTodos: PropTypes.func.isRequired,
    getSummary: PropTypes.func.isRequired,
    publishChanges: PropTypes.func.isRequired,
    discardChanges: PropTypes.func.isRequired,
    operationInProgress: PropTypes.bool.isRequired,
    learnerCounts: PropTypes.object
  };
  handleDraftVersion = () => {
    const {
      todos,
      match,
      baseUrl,
      showTodos,
      showInviteOptions,
      publishSummary,
      publishHistory,
      publishChanges,
      discardChanges,
      hasUnpublishedChanges,
      defaultInviteOption,
      moduleType,
      operationInProgress,
      learnerCounts
    } = this.props;

    const {
      params: { version }
    } = match;

    const redirectUrl = getPublishVersionUrl({
      baseUrl,
      version: getLatestVersion(publishHistory)
    });
    return hasUnpublishedChanges ? (
      <UnpublishedChanges
        key="unpubchanges"
        todos={todos}
        summary={publishSummary[version] || []}
        moduleType={moduleType}
        showTodos={showTodos}
        publish={publishChanges}
        discard={discardChanges}
        showInviteOptions={showInviteOptions}
        defaultInviteOption={defaultInviteOption}
        operationInProgress={operationInProgress}
        learnerCounts={learnerCounts}
      />
    ) : match.url !== redirectUrl ? (
      <Redirect key="redirectToLatest" to={redirectUrl} />
    ) : null;
  };
  redirectToDraftVersion = () => {
    const { match, baseUrl } = this.props;
    const redirectUrl = getPublishVersionUrl({
      baseUrl,
      version: DRAFT_VERSION_DETAILS.version
    });
    return match.url !== redirectUrl ? <Redirect to={redirectUrl} /> : null;
  };
  getInitialPublishContent = ({ versionDetails }) => {
    return (
      <div className="ph-first_live">
        <Icon type="first_live" />
        <div className="ph-first_live_text">
          Published On {GET_VERSION_DISPLAY_NAME(versionDetails.time)}
        </div>
      </div>
    );
  };
  componentWillReceiveProps(newProps) {
    const {
      match: {
        params: { version: newVersion }
      }
    } = newProps;
    const {
      match: {
        params: { version: oldVersion }
      },
      getSummary
    } = this.props;
    if (oldVersion !== newVersion) {
      getSummary(newVersion);
    }
  }
  componentDidMount() {
    const {
      match: {
        params: { version }
      },
      getSummary
    } = this.props;
    getSummary(version);
  }
  render() {
    const {
      match: {
        params: { version }
      },
      publishSummary,
      publishHistory
    } = this.props;

    const versionDetails = publishHistory.filter(details => {
      return details.version == version;
    })[0];

    if (version == DRAFT_VERSION_DETAILS.version) {
      return [
        <PublishHeading key="pubHeading" title={GET_TITLE(versionDetails)} />,
        this.handleDraftVersion()
      ];
    } else if (!versionDetails) {
      return this.redirectToDraftVersion();
    } else if (versionDetails.prevVersion) {
      return [
        <PublishHeading key="pubHeading" title={GET_TITLE(versionDetails)} />,
        <PublishedChanges key="content" summary={publishSummary[version] || []} />
      ];
    } else {
      return this.getInitialPublishContent({ versionDetails });
    }
  }
}

class AllChanges extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };
  render() {
    const { match, ...rest } = this.props;
    return (
      <div key="section-right" className="ph-right-container">
        <Switch>
          <Route
            exact
            path={`${match.url}/:version`}
            render={props => <Content {...rest} baseUrl={match.url} {...props} />}
          />
          <Redirect to={`${match.url}/${DRAFT_VERSION_DETAILS.version}`} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(AllChanges);
