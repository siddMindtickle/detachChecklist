import React, { Component } from "react";
import PropTypes from "prop-types";

import { deepEqual } from "@utils";
import { infoToast as InfoToast } from "@utils/toast";
import Learner from "../../components/learner";
import NewLearnerForm from "../../components/newLearnerForm";
import InviteFooter from "../../components/inviteFooter";

import { INVITE_TYPE } from "../../config/constants";
import ModuleRelevanceCell from "../moduleRelevanceCell";

import style from "./index.scss";

export default class AddInviteNewLearners extends Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    checkExist: PropTypes.func.isRequired,
    invite: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,

    searchedLearners: PropTypes.array.isRequired,
    learners: PropTypes.object.isRequired,
    userToAdd: PropTypes.object,
    enabledFeatures: PropTypes.object,
    defaultModuleRelevance: PropTypes.string,
    inviteToSeries: PropTypes.bool.isRequired
  };

  state = {
    learnersToInvite: {},
    disableInvite: true,
    dropDownOptions: [],
    moduleRelevanceSelection: {},
    defaultModuleRelevanceSelection: this.props.defaultModuleRelevance || "NONE"
  };

  componentWillReceiveProps(nextProps) {
    const { learners, searchedLearners, userToAdd } = nextProps;

    if (!deepEqual(userToAdd, this.props.userToAdd)) {
      let learnersToInvite = { ...this.state.learnersToInvite };
      learnersToInvite[userToAdd.email] = {
        email: userToAdd.email,
        name: userToAdd.name
      };
      this.setState({
        learnersToInvite,
        disableInvite: false
      });
    }

    if (!deepEqual(searchedLearners, this.props.searchedLearners)) {
      let slearners = searchedLearners.map(learnerId => learners[learnerId]);
      this.setState({ dropDownOptions: slearners });
    }
  }

  addLearnerToInviteList = (email, name) => {
    const lowerCaseEmail = email.toLowerCase();
    if (this.state.learnersToInvite[lowerCaseEmail]) {
      return InfoToast({ message: "Already added to list" });
    }
    this.props.checkExist({ email: lowerCaseEmail, name });
  };

  inviteAll = () => {
    const { moduleRelevanceEnabled } = this.props.enabledFeatures;
    const {
      learnersToInvite,
      defaultModuleRelevanceSelection,
      moduleRelevanceSelection
    } = this.state;
    let learnerArray = Object.values(learnersToInvite).filter(value => value);
    if (moduleRelevanceEnabled)
      learnerArray = learnerArray.map(learner => {
        return {
          moduleRelevance: this.state.moduleRelevanceSelection[learner.email]
            ? moduleRelevanceSelection[learner.email]
            : defaultModuleRelevanceSelection,
          ...learner
        };
      });

    if (learnerArray.length) {
      this.props.invite(
        INVITE_TYPE.ADD_INVITE_NEW,
        learnerArray,
        null,
        moduleRelevanceEnabled
          ? {
              moduleRelevanceEnabled,
              moduleRelevanceSelection,
              defaultModuleRelevanceSelection
            }
          : { moduleRelevanceEnabled: moduleRelevanceEnabled }
      );
      this.props.close();
    }
  };

  removeLearner = id => {
    let listObj = { ...this.state.learnersToInvite };
    listObj[id] = null;

    let disableInvite = false;

    let learnerArray = Object.values(listObj).filter(v => v);
    if (!learnerArray.length) disableInvite = true;

    this.setState({ learnersToInvite: listObj, disableInvite });
  };

  handleRelevanceUpdate = (params = {}) => {
    const { key, value } = params;
    let newState = {};
    let newModuleRelevanceSelection = {
      ...this.state.moduleRelevanceSelection
    };

    newModuleRelevanceSelection[key] = value;

    newState["moduleRelevanceSelection"] = newModuleRelevanceSelection;

    this.setState(newState);
  };

  renderLearner = key => {
    const { moduleRelevanceEnabled } = this.props.enabledFeatures;
    let learnerObj = this.state.learnersToInvite[key];
    const { moduleRelevanceSelection, defaultModuleRelevanceSelection } = this.state;

    const { inviteToSeries } = this.props;
    if (learnerObj !== null) {
      return [
        <Learner
          {...learnerObj}
          key={key}
          id={key}
          remove={this.removeLearner}
          moduleRelevanceCell={
            inviteToSeries || !moduleRelevanceEnabled ? (
              ""
            ) : (
              <ModuleRelevanceCell
                key={key}
                isAllSelected={false}
                data={learnerObj}
                moduleRelevanceSelection={moduleRelevanceSelection}
                handleRelevanceUpdate={this.handleRelevanceUpdate}
                defaultModuleRelevanceSelection={defaultModuleRelevanceSelection}
                type={INVITE_TYPE.ADD_INVITE_NEW}
              />
            )
          }
        />
      ];
    }
  };

  render() {
    const { learnersToInvite, disableInvite, dropDownOptions } = this.state;
    const { search, close } = this.props;
    let learners = Object.keys(learnersToInvite).map(this.renderLearner);
    return (
      <div ref={this.setWrapperRef} className={style.addInviteNewLearnersWrapper}>
        <div className={style.addInviteNewLearners}>
          <NewLearnerForm
            addToLearnerList={this.addLearnerToInviteList}
            search={search}
            searchedLearners={dropDownOptions}
            className={style.addInviteLearner}
          />

          <div className={style.inviteLearnerList}>
            <ul className={style.ainl_newLearnerList}>{learners}</ul>
          </div>
        </div>
        <InviteFooter disableInvite={disableInvite} invite={this.inviteAll} cancel={close} />
      </div>
    );
  }
}
