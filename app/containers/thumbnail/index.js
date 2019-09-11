import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { injectReducer, injectSaga, getActions } from "@core/helpers";
import Modal from "@components/modal";

import showAlert from "@utils/alert";

import EditThumbnail from "./components/editThumbnail";
import ViewThumbnail from "./components/viewThumbnail";
import {
  OPERATIONS,
  THUMB_RENAME_ERROR_MESSAGES,
  THUMB_RENAME_ERROR_CODES
} from "./config/constants";

import saga from "./saga";
import reducer from "./reducer";
import { GET_THUMBNAILS, MANIPULATE_DATA } from "./actionTypes";

const { RENAME, REMOVE, UPDATE_LIST } = OPERATIONS;

class Thumbnail extends Component {
  static propTypes = {
    className: PropTypes.string,
    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    defaultThumb: PropTypes.object.isRequired,
    appliedThumb: PropTypes.object.isRequired,
    thumbnails: PropTypes.object,
    update: PropTypes.func.isRequired,
    getThumbnails: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    companyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operationStatus: PropTypes.object
  };
  static defaultProps = {
    thumbnails: {}
  };
  state = {
    showModal: false
  };

  showModal = (value = true) => {
    this.setState({ showModal: value });
  };

  closeModal = () => this.setState({ showModal: false });

  edit = () => {
    const { companyId, loaded, getThumbnails } = this.props;
    loaded ? this.showModal() : getThumbnails({ companyId });
  };

  rename = thumb => {
    const { manipulateData, companyId } = this.props;
    manipulateData({ operation: RENAME, companyId, thumb });
  };
  remove = thumb => {
    const { manipulateData, companyId } = this.props;
    manipulateData({ operation: REMOVE, companyId, thumb });
  };
  updateList = thumb => {
    const { manipulateData } = this.props;

    manipulateData({ operation: UPDATE_LIST, thumb });
  };
  update = thumb => {
    this.props.update(thumb);
    this.closeModal();
  };

  getModalBody = () => {
    const { defaultThumb, appliedThumb, thumbnails } = this.props;
    const customThumbnails = Object.keys(thumbnails).reduce((result, thumb) => {
      if (thumbnails[thumb]) result.push(thumbnails[thumb]);
      return result;
    }, []);
    customThumbnails.sort((a, b) => {
      if (a.thumbTitle < b.thumbTitle) return -1;
      if (a.thumbTitle > b.thumbTitle) return 1;
      return 0;
    });
    const combinedThumbs = {
      default: [defaultThumb],
      custom: customThumbnails
    };
    return (
      <EditThumbnail
        cancel={this.closeModal}
        rename={this.rename}
        remove={this.remove}
        update={this.update}
        updateList={this.updateList}
        thumbnails={combinedThumbs}
        selectedThumb={appliedThumb}
      />
    );
  };
  componentWillReceiveProps(newProps) {
    const { loaded } = newProps;

    if (loaded && this.props.loaded !== loaded && !this.state.showModal) {
      this.showModal(true);
    }
  }

  componentDidUpdate(prevProps) {
    const { operationStatus: { error: { errorCode: newErrorCode } = {} } = {} } = this.props;

    const { operationStatus: { error: { errorCode: oldErrorCode } = {} } = {} } = prevProps;

    if (newErrorCode && newErrorCode !== oldErrorCode) {
      switch (newErrorCode) {
        case THUMB_RENAME_ERROR_CODES.DUPLICATE:
          showAlert(THUMB_RENAME_ERROR_MESSAGES[newErrorCode], {
            id: "renameErrored",
            okBtnText: "OK"
          });
          break;

        case THUMB_RENAME_ERROR_CODES.EMPTY:
          showAlert(THUMB_RENAME_ERROR_MESSAGES[newErrorCode], {
            id: "renameErrored",
            okBtnText: "OK"
          });
          break;

        default:
          break;
      }
    }
  }

  render() {
    const { showModal } = this.state;
    const { className, appliedThumb } = this.props;

    return [
      <ViewThumbnail
        key="viewThumbnail"
        className={className}
        onEdit={this.edit}
        thumbnail={appliedThumb}
      />,
      showModal && (
        <Modal
          key="editThumbnail"
          show={showModal}
          close={this.closeModal}
          body={this.getModalBody()}
          title="Select a Thumbnail"
          modaltype="ModalLarge"
        />
      )
    ];
  }
}
const mapStateToProps = (state, ownProps) => {
  const {
    loaded,
    isLoading,
    hasError,
    thumbDetails: thumbnails,
    operationStatus
  } = state.moduleThumbnails;
  return {
    loaded,
    isLoading,
    hasError,
    thumbnails,
    operationStatus,
    ...ownProps
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getThumbnails: params => dispatch(getActions(GET_THUMBNAILS)(params)),
    manipulateData: params => dispatch(getActions(MANIPULATE_DATA)(params))
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "moduleThumbnails", reducer });
const withSaga = injectSaga({ name: "moduleThumbnails", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Thumbnail);
