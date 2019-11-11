import React, { Component } from "react";
import PropTypes from "prop-types";

import classnames from "classnames";

import { INVITE_TYPE } from "../../config/constants";

import Learner from "../../components/learner";
import InviteFooter from "../../components/inviteFooter";

import CsvParse from "@components/csvParser";
import Button from "@components/button";
import Icon from "@components/icon";
import { handleData, filterLearnersWithoutError } from "../../utils";
import style from "./index.scss";
import ModuleRelevanceCell from "../moduleRelevanceCell";

export default class UploadLearnerList extends Component {
  static propTypes = {
    invite: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    csvData: PropTypes.object.isRequired,
    downloadSample: PropTypes.func.isRequired,
    defaultModuleRelevance: PropTypes.string,
    inviteToSeries: PropTypes.bool.isRequired,
    enabledFeatures: PropTypes.object
  };

  state = {
    disableInvite: true,
    uniqueUsers: [],
    uploaded: false,
    defaultModuleRelevanceSelection: this.props.defaultModuleRelevance || "NONE"
  };

  handleRelevanceUpdate = (params = {}) => {
    const { uniqueUsers } = this.state;
    const { key, value } = params;

    let updatedUniqueUsers = [];

    if (uniqueUsers) {
      updatedUniqueUsers = uniqueUsers.map(user => {
        let updatedUser = { ...user };
        if (updatedUser.email === key) updatedUser.moduleRelevance = value;
        return updatedUser;
      });
    }

    this.setState({ uniqueUsers: updatedUniqueUsers });
  };

  inviteAll = () => {
    const { moduleRelevanceEnabled } = this.props.enabledFeatures;
    let learnersWithoutError = filterLearnersWithoutError(this.state.uniqueUsers);
    if (learnersWithoutError.length > 0) {
      this.props.invite(
        INVITE_TYPE.UPLOAD_LIST,
        learnersWithoutError,
        null,
        moduleRelevanceEnabled
          ? {
              moduleRelevanceEnabled: moduleRelevanceEnabled,
              defaultModuleRelevanceSelection: this.state.defaultModuleRelevanceSelection
            }
          : { moduleRelevanceEnabled: moduleRelevanceEnabled }
      );
    }
    this.props.close();
  };

  removeLearner = index => {
    let learnerList = [...this.state.uniqueUsers];
    learnerList.splice(index, 1);
    const learnersWithoutError = filterLearnersWithoutError(learnerList);
    const disableInvite = !learnersWithoutError.length;
    this.setState({
      uniqueUsers: learnerList,
      uploaded: !!learnerList.length,
      disableInvite: disableInvite
    });
  };

  renderLearners = () => {
    const { uniqueUsers, defaultModuleRelevanceSelection } = this.state;
    const {
      enabledFeatures: { moduleRelevanceEnabled },
      inviteToSeries
    } = this.props;

    return (
      <div className={style.ainl_newLearnerList}>
        {uniqueUsers.map((learner, index) => {
          const moduleRelevanceSelection = {
            [learner.email]: learner.moduleRelevance
              ? learner.moduleRelevance
              : defaultModuleRelevanceSelection
          };
          const showRelevance =
            inviteToSeries || !moduleRelevanceEnabled || (learner.errors && learner.errors.length)
              ? true
              : false;
          return (
            <Learner
              {...learner}
              key={`learner-${index}`}
              id={index}
              remove={this.removeLearner}
              moduleRelevanceCell={
                showRelevance ? (
                  ""
                ) : (
                  <ModuleRelevanceCell
                    key={`learner-relevance-${index}`}
                    isAllSelected={false}
                    data={learner}
                    moduleRelevanceSelection={moduleRelevanceSelection}
                    handleRelevanceUpdate={this.handleRelevanceUpdate}
                    defaultModuleRelevanceSelection={defaultModuleRelevanceSelection}
                    type={INVITE_TYPE.UPLOAD_LIST}
                  />
                )
              }
            />
          );
        })}
      </div>
    );
  };

  renderFileDownload = () => {
    const {
      csvData: { fileHeaders },
      downloadSample
    } = this.props;

    return (
      <div className={style.uploadBtns}>
        <Button
          type="DefaultSm"
          key="defaultBtnChecklistPublish1"
          className={style.btn1}
          onClick={downloadSample}
        >
          Download Sample
        </Button>
        <Icon type="right_arrow_wide" className={classnames("marginR10", style.icon)} />
        Add Participants
        <Icon type="right_arrow_wide" className={classnames("marginR10", style.icon)} />
        <div className="uploaderBtn">
          <CsvParse
            fileHeaders={fileHeaders}
            onDataUploaded={this.handleData}
            render={handleData => (
              <div>
                <label htmlFor="inviteLearner" className="uploadBtnText">
                  Upload File
                </label>
                <input
                  type="file"
                  id="inviteLearner"
                  className="uploadBtnInp"
                  onChange={handleData}
                />
              </div>
            )}
          />
        </div>
      </div>
    );
  };

  handleData = parsedData => {
    const { defaultModuleRelevance } = this.props;
    const map = { ...this.props.csvData.shortKeyToDisplayType };
    const uniqueUsers = handleData(parsedData, map, defaultModuleRelevance);
    const learnersWithoutError = filterLearnersWithoutError(uniqueUsers);
    const disableInvite = !learnersWithoutError.length;
    const uploaded = uniqueUsers && uniqueUsers.length;
    this.setState({
      uniqueUsers,
      disableInvite: disableInvite,
      uploaded: uploaded
    });
  };

  render() {
    const { uploaded, disableInvite, uniqueUsers } = this.state;
    const { close } = this.props;
    return [
      <div key="uploadLearnerList" className={style.inviteUploadListWrapper}>
        <div className={style.uploadLearnerListWrapper}>
          <div className={style.list}>
            {!uploaded ? this.renderFileDownload() : uniqueUsers && this.renderLearners()}

            <InviteFooter cancel={close} invite={this.inviteAll} disableInvite={disableInvite} />
          </div>
        </div>
      </div>
    ];
  }
}
