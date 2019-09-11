import React, { Component } from "react";
import PropTypes from "prop-types";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";

import GetSupport from "@containers/getSupport";

import Popover from "@components/popover";
import Button from "@components/button";
import Input from "@components/input";
import { CONSTANTS } from "./constants";

import { debounce, openWindow } from "@utils";
import { Defaults } from "@config/env.config";

import classnames from "classnames";
import style from "./index.scss";

const GetHelpPopover = ({ searchClickHandler, onChange, searchValue, onSupportClose, email }) => {
  return (
    <Popover id="popover-contained" className="customPosition">
      <h1>How can we help you?</h1>
      <div className={classnames(style.helpPopUpBox, "marginB10")}>
        <div className={style.subHeading}>Search help topics.</div>
        <div className={classnames("marginB10", "marginT10")}>
          <Input
            name="searchText"
            onChange={onChange}
            placeholder="How to.."
            value={searchValue}
            className="gh-input"
          />
          <Button type="PrimarySm" onClick={searchClickHandler} className="marginL10">
            Search
          </Button>
        </div>
      </div>
      <div className={classnames(style.helpPopUpBox, "marginB10")}>
        <GetSupport
          initiator="Report an issue with just one click!"
          className={classnames(style.reportIssueLink, "link")}
          onClose={onSupportClose}
          email={email}
        />
        <div className={style.paraText}>
          <span>Send a snapshot</span>

          <span className={classnames("onHover", "icon-info", "marginLR3")}>
            <span className={classnames("infoOnHover", style.infoMessage)}>
              Snapshot is the screeshot of the Mindtickle page. it does not include anything else.
            </span>
          </span>

          <span>of your current page and an error log to the help desk.</span>
        </div>
      </div>
      <div className="marginT25">
        <span className={style.copyRightlinks} onClick={() => openWindow(Defaults.mindtickleUrl)}>
          {Defaults.copyRightMindtickle}
        </span>
        <span className={style.copyRightlinks} onClick={() => openWindow(Defaults.privacyUrl)}>
          {Defaults.privacy}
        </span>
        <span
          className={style.copyRightlinks}
          onClick={() => openWindow(Defaults.knowledgeBaseUrl)}
        >
          {Defaults.knowledgeBase}
        </span>
      </div>
    </Popover>
  );
};

GetHelpPopover.propTypes = {
  searchClickHandler: PropTypes.func,
  searchValue: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSupportClose: PropTypes.func,
  email: PropTypes.string
};
export default class GetHelp extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    searchValue: "",
    rootClose: true
  };

  handleSupportClose = show => {
    this.setState({ rootClose: !show });
  };

  onSearch = debounce(searchValue => {
    this.setState({ searchValue });
  }, CONSTANTS.DEBOUNCE_TIME_OUT);

  getUrl = searchValue => `${Defaults.helpDeskUrl}?term=${searchValue}`;

  handleSearchClick = () => {
    const { searchValue } = this.state;
    if (searchValue) {
      this.setState({ searchValue: "" });
      openWindow(this.getUrl(searchValue));
    }
  };

  handleTextChange = event => {
    this.onSearch(event.target.value);
  };

  render() {
    return (
      <div className={classnames(style.getHelpStyle, "getHelp", this.props.className)}>
        <OverlayTrigger
          trigger="click"
          rootClose={this.state.rootClose}
          container={this}
          overlay={
            <GetHelpPopover
              searchValue={this.state.searchValue}
              searchClickHandler={this.handleSearchClick}
              onChange={this.handleTextChange}
              onSupportClose={this.handleSupportClose}
              {...this.props}
            />
          }
        >
          <span className={classnames(style.icon, "icon-help")} />
        </OverlayTrigger>
      </div>
    );
  }
}
