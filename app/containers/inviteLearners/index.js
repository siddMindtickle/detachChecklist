import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getActions, injectSaga, injectReducer } from "@core/helpers";
import { deepEqual, noop } from "@utils";
import {
  infoToast as InfoToast,
  errorToast as ErrorToast,
  successToast as SuccessToast
} from "@utils/toast";

import WrapperInviteNew from "./components/wrapperInviteNew";
import WrapperUploadList from "./components/wrapperUploadList";
import WrapperInviteGroups from "./components/wrapperInviteGroups";
import WrapperInviteExisting from "./components/wrapperInviteExisting";

import ModalPopup from "@components/modal/index";
import modalWithHelp from "@hocs/modalWithHelp";
import Accordion from "@components/accordion";
import Button from "@components/button";

import saga from "./saga";

import style from "./index.scss";

import { getInviteOptions } from "./utils";
import { INVITE_TYPE, INVITE_TYPE_DETAILS, INVITE_TO, MESSAGES } from "./config/constants";

import GET_ERROR_MESSAGES from "./config/error.messages";

import reducer from "./reducer";

import {
  MANIPULATE_INVITE,
  MANIPULATE_INVITE_NEW,
  MANIPULATE_INVITE_EXISTING,
  INITIAL_INVITE_EXISTING,
  INITIAL_INVITE_GROUP,
  INITIAL_INVITE_BY_UPLOAD,
  GET_PROFILE_KEY_DATA,
  SET_CONTEXT
} from "./actionTypes";

const ModalWithHelp = modalWithHelp(ModalPopup);

class InviteLearners extends Component {
  static propTypes = {
    inviteNew: PropTypes.object.isRequired,
    inviteUpload: PropTypes.object.isRequired,
    inviteExisting: PropTypes.object.isRequired,
    inviteGroups: PropTypes.object.isRequired,
    invite: PropTypes.func.isRequired,
    onInvite: PropTypes.func,
    setContext: PropTypes.func,
    invitePolling: PropTypes.object.isRequired,
    companyId: PropTypes.string.isRequired,
    moduleId: PropTypes.string,
    seriesId: PropTypes.string,
    disabled: PropTypes.bool,
    moduleType: PropTypes.string.isRequired,
    globalPermissions: PropTypes.object.isRequired,
    seriesPermissions: PropTypes.object.isRequired,
    isSiteOwner: PropTypes.bool.isRequired,
    className: PropTypes.string,
    enabledFeatures: PropTypes.shape({
      moduleRelevanceEnabled: PropTypes.bool.isRequired
    }).isRequired,
    defaultModuleRelevance: PropTypes.string
  };

  static defaultProps = {
    onInvite: noop,
    disabled: false
  };

  state = {
    showModal: false,
    inviteToSeries: false,
    inviteType: ""
  };

  invite = (type, data, filters, moduleRelevanceOptions) => {
    const {
      moduleRelevanceEnabled,
      moduleRelevanceSelection,
      defaultModuleRelevanceSelection
    } = moduleRelevanceOptions;
    const { inviteToSeries } = this.state;
    const { invite } = this.props;
    let params = {};
    switch (type) {
      case INVITE_TYPE.ADD_INVITE_NEW:
      case INVITE_TYPE.UPLOAD_LIST:
        params = {
          operation: type,
          learners: data,
          inviteToSeries,
          defaultModuleRelevanceSelection,
          moduleRelevanceEnabled
        };
        break;

      case INVITE_TYPE.INVITE_GROUP:
        params = {
          operation: type,
          groups: data,
          inviteToSeries,
          moduleRelevanceSelection,
          defaultModuleRelevanceSelection,
          moduleRelevanceEnabled
        };
        break;
      case INVITE_TYPE.INVITE_EXISTING:
        params = {
          operation: type,
          ids: data,
          inviteToSeries,
          filters,
          moduleRelevanceSelection,
          defaultModuleRelevanceSelection,
          moduleRelevanceEnabled
        };
    }
    invite(params);
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  getModalBody = () => {
    let { companyId } = this.props;
    const { inviteType } = this.state;
    let { component: Component, props } = this.getComponentByInviteType(inviteType);
    props = {
      ...props,
      companyId
    };

    return <Component {...props} />;
  };

  selectInviteOption = (inviteTo, inviteType) => {
    this.setState({
      inviteToSeries: inviteTo === INVITE_TO.SERIES,
      showModal: true,
      inviteType
    });
  };

  getComponentByInviteType = inviteType => {
    const {
      inviteNew,
      inviteUpload,
      inviteExisting,
      inviteGroups,
      enabledFeatures,
      defaultModuleRelevance
    } = this.props;
    const coreProps = {
      close: this.closeModal,
      invite: this.invite,
      inviteToSeries: this.state.inviteToSeries,
      enabledFeatures: enabledFeatures,
      defaultModuleRelevance
    };
    switch (inviteType) {
      case INVITE_TYPE.ADD_INVITE_NEW:
        return {
          component: WrapperInviteNew,
          props: {
            ...inviteNew,
            ...coreProps
          }
        };
      case INVITE_TYPE.UPLOAD_LIST:
        return {
          component: WrapperUploadList,
          props: {
            ...inviteUpload,
            ...coreProps
          }
        };
      case INVITE_TYPE.INVITE_EXISTING:
        return {
          component: WrapperInviteExisting,
          props: {
            ...inviteExisting,
            ...coreProps
          }
        };
      case INVITE_TYPE.INVITE_GROUP:
        return {
          component: WrapperInviteGroups,
          props: {
            ...inviteGroups,
            ...coreProps
          }
        };
    }
  };

  componentWillMount() {
    const { moduleType, globalPermissions, seriesPermissions, isSiteOwner } = this.props;
    this.inviteOptions = getInviteOptions({
      moduleType,
      globalPermissions,
      seriesPermissions,
      isSiteOwner
    });
  }

  componentDidMount() {
    const { moduleId, seriesId, companyId, setContext, moduleType } = this.props;
    const params = { moduleId, seriesId, companyId, moduleType };
    setContext(params);
  }

  componentWillReceiveProps(nextProps) {
    const { invitePolling, onInvite } = this.props;
    const oldPollState = {
      isLoading: invitePolling.isLoading,
      loaded: invitePolling.loaded,
      hasError: invitePolling.hasError
    };
    const newPollState = {
      isLoading: nextProps.invitePolling.isLoading,
      loaded: nextProps.invitePolling.loaded,
      hasError: nextProps.invitePolling.hasError
    };
    const { data: { successIds = [], errorIds = [] } = {} } = nextProps.invitePolling;
    if (!deepEqual(oldPollState, newPollState)) {
      if (newPollState.isLoading) {
        InfoToast({ message: MESSAGES.INVITE_LEARNER.LOADING(), freeze: true });
      } else if (newPollState.hasError) {
        ErrorToast({ message: GET_ERROR_MESSAGES(newPollState.error) });
      } else if (newPollState.loaded) {
        SuccessToast({
          message: MESSAGES.INVITE_LEARNER.SUCCESS({
            successCount: successIds.length,
            failCount: errorIds.length
          })
        });
        onInvite();
        this.setState(this.getResetMultiState);
      }
    }
  }

  render() {
    const { showModal, inviteType } = this.state;
    const { disabled } = this.props;
    if (!this.inviteOptions.length) return null;
    if (disabled) {
      return (
        <Button type="PrimarySm" onClick={noop} disabled={true}>
          Invite Learners
        </Button>
      );
    }
    return (
      <div className={(this.props.className, "ac_styleCustom")}>
        <Accordion
          title="Invite Learners"
          options={this.inviteOptions}
          onSelect={this.selectInviteOption}
        />{" "}
        {showModal && (
          <ModalWithHelp
            componentClassName={style.inviteLearnersModal}
            title={INVITE_TYPE_DETAILS[inviteType].title}
            body={this.getModalBody()}
            show={showModal}
            close={this.closeModal}
            modaltype="ModalLarge"
          />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setContext: params => dispatch(getActions(SET_CONTEXT)(params)),
    handleInviteOperations: options => dispatch(getActions(MANIPULATE_INVITE)(options)),
    handleInviteNewOperations: options => dispatch(getActions(MANIPULATE_INVITE_NEW)(options)),
    handleInviteExistingOperations: options =>
      dispatch(getActions(MANIPULATE_INVITE_EXISTING)(options)),

    getFileUploadData: options => dispatch(getActions(INITIAL_INVITE_BY_UPLOAD)(options)),
    getInviteExistingLearnersData: options =>
      dispatch(getActions(INITIAL_INVITE_EXISTING)(options)),
    getInviteGroupsData: options => dispatch(getActions(INITIAL_INVITE_GROUP)(options)),

    getProfileKeyData: options => dispatch(getActions(GET_PROFILE_KEY_DATA)(options))
  };
};

const mapStateToProps = state => {
  const {
    existingLearners = [],
    inviteNew,
    inviteCommon,
    inviteGroups,
    inviteByUpload,
    inviteExisting,
    invitePolling
  } = state.moduleInvite;

  const { features = {} } = state.auth.data;

  return {
    existingLearners,
    inviteNew,
    inviteCommon,
    inviteGroups,
    inviteByUpload,
    inviteExisting,
    invitePolling,
    enabledFeatures: features
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    inviteCommon: {
      searchedLearners = {},
      learners = {},
      managerFields: { data: managerFields } = {},
      profileFields: { data: profileFields } = {},
      profileKeyData: { data: profileKeyData = {} } = {},
      groups: { data: groups = [] } = {}
    },
    inviteNew,
    inviteGroups,
    inviteByUpload,
    inviteExisting,
    invitePolling
  } = stateProps;
  return {
    inviteNew: {
      searchedLearners: searchedLearners.data || [],
      learners: learners,
      status: inviteNew.status || {},
      operate: dispatchProps.handleInviteNewOperations
    },
    inviteUpload: {
      getData: dispatchProps.getFileUploadData,
      managerFields: managerFields,
      profileFields: profileFields,
      loaded: inviteByUpload.loaded,
      isLoading: inviteByUpload.isLoading,
      hasError: inviteByUpload.hasError
    },
    inviteExisting: {
      loaded: inviteExisting.loaded,
      isLoading: inviteExisting.isLoading,
      hasError: inviteExisting.hasError,
      learners: learners,
      searchedLearners: searchedLearners,
      profileFields: profileFields,
      profileKeyData: profileKeyData,
      groups: groups,
      status: inviteExisting.status || {},
      operate: dispatchProps.handleInviteExistingOperations,
      getData: dispatchProps.getInviteExistingLearnersData,
      getProfileKeyData: dispatchProps.getProfileKeyData
    },
    inviteGroups: {
      groups: groups,
      getGroups: dispatchProps.getInviteGroupsData,
      loaded: inviteGroups.loaded,
      isLoading: inviteGroups.isLoading,
      hasError: inviteGroups.hasError
    },
    invite: dispatchProps.handleInviteOperations,
    invitePolling: invitePolling,
    companyId: ownProps.companyId,
    moduleId: ownProps.moduleId,
    seriesId: ownProps.seriesId,
    moduleType: ownProps.moduleType,
    onInvite: ownProps.onInvite,
    className: ownProps.className,
    setContext: dispatchProps.setContext,
    globalPermissions: ownProps.globalPermissions,
    seriesPermissions: ownProps.seriesPermissions,
    isSiteOwner: ownProps.isSiteOwner,
    disabled: ownProps.disabled,
    enabledFeatures: stateProps.enabledFeatures,
    defaultModuleRelevance: ownProps.defaultModuleRelevance
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
);
const withReducer = injectReducer({ name: "moduleInvite", reducer });
const withSaga = injectSaga({ name: "moduleInvite", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(InviteLearners);
