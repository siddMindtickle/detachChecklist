import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Radio from "@components/radio";
import Dropdown from "@components/dropdown";
import LearnersListing from "../LearnersListing";
import MenuItem from "../menuItem/index";

import { LEARNER_TYPES, LEARNERS_CONFIG } from "../../config/constants";

import style from "./index.scss";

const MENU_ITEMS = [LEARNER_TYPES.ALL, LEARNER_TYPES.FULL];

class PublishWithSelection extends Component {
  static propTypes = {
    count: PropTypes.object,
    data: PropTypes.object.isRequired,
    seriesName: PropTypes.string,
    actions: PropTypes.object,
    onSelect: PropTypes.func,
    learnerType: PropTypes.string,
    moduleType: PropTypes.string.isRequired,
    numOfSelectedLearners: PropTypes.number,
    mappedSeries: PropTypes.arrayOf(PropTypes.string)
  };

  state = {
    invite: true,
    showModal: false,
    selectedOptions: {},
    selectedType: LEARNER_TYPES.FULL,
    modalType: LEARNER_TYPES.FULL
  };

  componentWillMount() {
    this.options = this.getOptions(this.props.count);
  }

  getOptions = count => {
    const MENU_ITEMS_NEW = [...MENU_ITEMS];
    count.selectOption && MENU_ITEMS_NEW.push(LEARNER_TYPES.SELECTED);

    return MENU_ITEMS_NEW.map(learnerType => {
      const { menuItemKey, countKey } = LEARNERS_CONFIG[learnerType];
      return {
        value: learnerType,
        element: (
          <MenuItem
            key={`menuitem-learner${menuItemKey}`}
            onViewClick={this.handleViewClick}
            type={learnerType}
            count={count[countKey]}
            showViewOption={learnerType !== LEARNER_TYPES.SELECTED}
          />
        )
      };
    });
  };

  // handlers
  openModal = type => {
    let { selectedType } = this.state;
    if (type == LEARNER_TYPES.SELECTED) {
      selectedType = type;
    }
    this.setState({ showModal: true, selectedType, modalType: type });
  };

  handleModalClose = () => this.setState({ showModal: false });

  handleViewClick = e => {
    e.stopPropagation(); // In order to avoid item click to be triggered
    const type = e.currentTarget.dataset.type;
    this.openModal(type);
  };

  getNumOfLearners = ({ type, ...options }) => {
    let numOfSelectedLearners = this.props.numOfSelectedLearners;
    const count = this.props.count;
    switch (type) {
      case LEARNER_TYPES.SELECTED:
        numOfSelectedLearners = options.totalSelected;
        break;
      case LEARNER_TYPES.FULL:
        numOfSelectedLearners = count.fullCount;
        break;
      case LEARNER_TYPES.ALL:
        numOfSelectedLearners = count.allCount;
        break;
    }
    return numOfSelectedLearners;
  };

  // on clicking any of the options in Dropdown
  handleSelectOption = (value, event) => {
    event.stopPropagation();
    this.setState({ selectedType: value });
    if (value === LEARNER_TYPES.SELECTED) {
      this.openModal(LEARNER_TYPES.SELECTED);
    } else {
      this.props.onSelect({
        learnerType: value,
        selectedType: value,
        numOfSelectedLearners: this.getNumOfLearners({ type: value })
      });
    }
  };

  // on clicking primary button from the learners screen
  handleLearnersSelect = ({ type, ...options }) => {
    type == LEARNER_TYPES.SELECTED &&
      this.props.onSelect({
        numOfSelectedLearners: this.getNumOfLearners({ type, ...options }),
        learnerType: type,
        selectedType: type,
        selectedOptions: options
      });
    this.handleModalClose();
  };

  handleSelectBoxClick = event => {
    const selected = event.currentTarget.dataset.type;
    const boxValue = selected === "left" ? true : false;
    this.props.onSelect({
      learnerType: boxValue ? this.state.selectedType : LEARNER_TYPES.NONE
    });
    this.setState({ invite: boxValue });
  };

  renderModal = () => {
    if (this.state.showModal) {
      const { data, seriesName, actions, moduleType, mappedSeries } = this.props;
      const propsToPass = {
        data,
        seriesName,
        actions,
        moduleType,
        mappedSeries
      };
      return (
        <LearnersListing
          {...propsToPass}
          type={this.state.modalType}
          onClose={this.handleModalClose}
          onSelect={this.handleLearnersSelect}
        />
      );
    }
  };

  render() {
    const { invite } = this.state;
    const { moduleType } = this.props;
    const getSelectedText = LEARNERS_CONFIG[this.props.learnerType].getSelectedText;
    return (
      <div className={style.publishWithSelection}>
        <div className={style.inviteWhoText}>
          <span>Once published, who should be {}</span>
          <span className={style.bold}>invited to this {moduleType}?</span>
        </div>
        <div className={classnames(style.inviteLearnersBox, "inviteLearnersBox")}>
          <div
            data-type="left"
            className={classnames(
              style.inviteLearnersBoxLeft,
              "inviteLearnersBoxLeft",
              invite && "selected"
            )}
            onClick={this.handleSelectBoxClick}
          >
            <div className={style.innerInviteLearnersBox}>
              <div className={style.innerInnerInviteLearnersBox}>
                <div className="radioBtnPublish">
                  <Radio key={"RadioPublishing1"} checked={invite} />
                </div>
                <div className={style.inviteLearner}>
                  <div>Invite</div>
                  <Dropdown
                    id={"checklistPublishDrpdown"}
                    options={this.options}
                    title={getSelectedText(this.props.numOfSelectedLearners)}
                    className="checklistPublishDrpdown"
                    onSelect={this.handleSelectOption}
                  />
                  <div>of this</div>
                  <div className={style.textSpace}>series.</div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-type="right"
            className={classnames(
              style.inviteLearnersBoxRight,
              "inviteLearnersBoxRight",
              !invite && "selected"
            )}
            onClick={this.handleSelectBoxClick}
          >
            <div className={style.innerInviteLearnersBox}>
              <div className={style.innerInnerInviteLearnersBox}>
                <div className="radioBtnPublish">
                  <Radio key={"RadioPublishing2"} checked={!invite} />
                </div>
                <div className={style.inviteLearner}>
                  <div>Dont invite anyone for now.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default PublishWithSelection;
