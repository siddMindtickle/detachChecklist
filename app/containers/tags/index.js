import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";

import { injectReducer, injectSaga, getActions } from "@core/helpers";
import { haveAccess } from "@app/utils/permissions";

import WithTracking from "@hocs/WithTracking";

import Modal from "@components/modal";
import ModuleIcon from "@components/moduleIcon";
import Info from "@components/info";
import Icon from "@components/icon";

import ChooseTags from "./components/chooseTags";
import AppliedTags from "./components/appliedTags";

import saga from "./saga";
import reducer from "./reducer";
import { GET_APPLIED_TAGS, MANIPULATE_DATA, GET_SUGGESTED_TAGS } from "./actionTypes";
import { OPERATIONS, PERMISSIONS } from "./config/constants";
import { getTrackingParams } from "./mixpanel/utils";
import style from "./index.scss";
import modalWithHelp from "@hocs/modalWithHelp";

const ModalWithHelp = modalWithHelp(Modal);

const { UPDATE, REMOVE, ADD, SEARCH } = OPERATIONS;

class Tags extends Component {
  static propTypes = {
    className: PropTypes.string,
    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    appliedTags: PropTypes.object,
    getAppliedTags: PropTypes.func.isRequired,
    canCreateTags: PropTypes.bool.isRequired,
    canApplyTags: PropTypes.bool.isRequired,
    suggestedTagsLoaded: PropTypes.bool,
    suggestedTags: PropTypes.array,
    getSuggestedTags: PropTypes.func.isRequired,
    searchedTags: PropTypes.object,
    tags: PropTypes.object,
    categories: PropTypes.object,
    track: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    operationStatus: PropTypes.shape({
      loaded: PropTypes.bool,
      isLoading: PropTypes.bool,
      hasError: PropTypes.bool
    }),
    moduleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    companyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    moduleName: PropTypes.string.isRequired,
    moduleType: PropTypes.string.isRequired
  };

  static defaultProps = {
    appliedTags: {},
    searchedTags: {},
    tags: {},
    categories: {},
    operationStatus: {}
  };

  state = {
    showModal: false
  };

  showModal = (value = true) => {
    this.setState({ showModal: value });
  };

  closeModal = () => this.setState({ showModal: false });

  searchTags = query => {
    this.handleOperations({ operation: SEARCH, query });
  };

  removeTag = id => {
    this.handleOperations({ operation: REMOVE, processIds: [id] });
  };

  applyTags = tags => {
    this.handleOperations({ operation: UPDATE, processIds: tags });
  };

  createTag = ({ tagName, categoryId }) => {
    this.handleOperations({ operation: ADD, name: tagName, categoryId });
  };

  handleOperations = ({ operation, ...data }) => {
    const { moduleId, seriesId, companyId, manipulateData } = this.props;
    const context = { moduleId, seriesId, companyId, operation };
    manipulateData({ ...context, ...data });
  };

  getModalBody = () => {
    const {
      categories,
      tags,
      searchedTags,
      appliedTags,
      suggestedTags,
      canCreateTags
    } = this.props;
    return (
      <ChooseTags
        apply={this.applyTags}
        search={this.searchTags}
        create={this.createTag}
        cancel={this.closeModal}
        categoriesMap={categories}
        tagsMap={tags}
        tags={searchedTags.data}
        appliedTags={appliedTags}
        canCreateTags={canCreateTags}
        suggestedTags={suggestedTags}
      />
    );
  };

  getModuleTitle = () => {
    const { moduleType, moduleName } = this.props;
    return [
      <ModuleIcon moduleType={moduleType} key="moduleTypeIcon" className={"marginR5"} />,
      <span key="moduleName">{moduleName}</span>
    ];
  };

  componentWillReceiveProps(newProps) {
    const {
      operationStatus: { loaded }
    } = this.props;
    const { operationStatus: { loaded: newLoadedState, data: { operation } = {} } = {} } = newProps;
    if (newLoadedState && !this.state.showModal && operation == SEARCH) {
      this.showModal();
    }
    if (newLoadedState !== loaded && operation == UPDATE) {
      this.closeModal();
    }
  }
  componentDidMount() {
    const { loaded, getAppliedTags, moduleId, seriesId, companyId } = this.props;
    !loaded && getAppliedTags({ moduleId, seriesId, companyId });
  }

  componentDidUpdate(prevProps, prevState) {
    const { showModal: prevShowModal } = prevState;
    const { showModal } = this.state;
    const { track, suggestedTagsLoaded, getSuggestedTags, companyId } = this.props;
    if (showModal && showModal !== prevShowModal) {
      !suggestedTagsLoaded && getSuggestedTags({ companyId });
      const event = "module_apply_tags_click";
      const trackParams = {
        ...getTrackingParams(this.props),
        location: "module_setting_popup"
      };
      track(event, trackParams);
    }
  }

  render() {
    const { showModal } = this.state;
    let { canApplyTags, appliedTags, tags: tagsMap } = this.props;
    appliedTags = Object.keys(appliedTags).filter(id => appliedTags[id]);

    if (!canApplyTags) {
      return null;
    }

    return (
      <div className={classnames("boxStyle", this.props.className)}>
        <div className={style.headerSection}>
          <div className={style.heading}>Tags</div>
          <Info content={"Tags"} className="cwt-infoIcon" />
        </div>

        <div className={style.tagsSection}>
          <AppliedTags tags={appliedTags} tagsMap={tagsMap} onRemove={this.removeTag} />
          <div className={classnames({ floatL: appliedTags.length })}>
            <div
              className={classnames("link", style.customLinkStyle)}
              onClick={() => this.searchTags()}
            >
              <span>
                Apply {appliedTags.length ? "More" : ""} Tags{" "}
                {appliedTags.length ? (
                  ""
                ) : (
                  <Icon type="right_arrow" className={style.rightArrowIcon} />
                )}
              </span>
            </div>
          </div>
          {showModal && (
            <ModalWithHelp
              show={showModal}
              close={this.closeModal}
              body={this.getModalBody()}
              title={this.getModuleTitle()}
              modaltype="ModalLarge"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    loaded,
    isLoading,
    hasError,
    appliedTags,
    tags,
    categories,
    searchedTags,
    operationStatus,
    suggestedTags: {
      loaded: suggestedTagsLoaded,
      hasError: suggestedTagshasError,
      tagList: suggestedTagsList
    } = {}
  } = state.moduleTags;
  const {
    auth: { data: { permissions } = {} }
  } = state;
  const canApplyTags = haveAccess([PERMISSIONS.APPLY_TAGS], permissions);
  const canCreateTags = haveAccess([PERMISSIONS.CREATE_EDIT_TAGS], permissions);
  const { moduleId, seriesId, companyId } = ownProps;
  const suggestedTags = suggestedTagsLoaded && !suggestedTagshasError ? suggestedTagsList : [];
  return {
    loaded,
    isLoading,
    hasError,
    appliedTags,
    tags,
    categories,
    searchedTags,
    moduleId,
    seriesId,
    companyId,
    operationStatus,
    suggestedTagsLoaded,
    suggestedTags,
    canApplyTags,
    canCreateTags
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getSuggestedTags: ({ companyId }) => dispatch(getActions(GET_SUGGESTED_TAGS)({ companyId })),
    getAppliedTags: ({ moduleId, seriesId, companyId }) =>
      dispatch(getActions(GET_APPLIED_TAGS)({ moduleId, seriesId, companyId })),
    manipulateData: data => {
      dispatch(getActions(MANIPULATE_DATA)(data));
    }
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "moduleTags", reducer });
const withSaga = injectSaga({ name: "moduleTags", saga });
const withTracking = WithTracking();

export default compose(
  withTracking,
  withReducer,
  withSaga,
  withConnect
)(Tags);
