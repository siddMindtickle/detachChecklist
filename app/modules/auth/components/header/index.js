import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withRouter } from "react-router-dom";

import Dropdown from "@components/dropdown";
import Insights from "@components/insights";
/*import GetSupport from "@containers/getSupport";*/

import { reload, getAcronym, openWindow } from "@utils";
import { ACCESS_LINK_URL, getStaticUrl } from "@utils/generateUrls";
import { getBurgerMenuOptions } from "../../utils";

import {
  //USER_PROFILE_OPTIONS,
  BURGER_MENU_KEY,
  PROFILE_KEY,
  CONTENT_ACCESS_TAB_NAME,
  HELP_MENU_KEY,
  HELP_MENU_OPTIONS,
  DROPDOWN_TYPES
} from "../../config/constants";

import style from "./index.scss";

/*const noop = () => undefined;*/

const ContentAccessLinks = ({ items, activeTab }) => {
  const links = items.map(function(option, i) {
    return (
      <li key={i}>
        <a
          href={option.link}
          className={classnames({ [style.active]: option.title === activeTab })}
        >
          {option.title}
        </a>
      </li>
    );
  });
  return (
    <div className={classnames(style.navBar, !links.length && "displayN")}>
      <ul>{links}</ul>
    </div>
  );
};
ContentAccessLinks.propTypes = {
  items: PropTypes.array.isRequired,
  activeTab: PropTypes.oneOf(Object.values(CONTENT_ACCESS_TAB_NAME))
};

const UserProfile = ({ items, title, onSelect }) => {
  return (
    <div className={classnames(style.cName, "marginT10", "headerDropdownStyle")}>
      <Dropdown
        title={title}
        className={style.cNameStyle}
        noCaret={true}
        caretPosition="right"
        options={items}
        id="user_profile_dropdown"
        onSelect={onSelect}
      />
    </div>
  );
};

UserProfile.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  onSelect: PropTypes.func
};

const UserDropdownMenuItem = ({ text, subtext, onClick, onSubTextClick }) => (
  <div>
    <div onClick={onClick}>{text}</div>
    {subtext && (
      <div className="link" onClick={event => onSubTextClick(event, subtext)}>
        {`(${subtext})`}
      </div>
    )}
  </div>
);

UserDropdownMenuItem.propTypes = {
  text: PropTypes.string,
  subtext: PropTypes.string,
  onClick: PropTypes.func,
  onSubTextClick: PropTypes.func
};

const BurgerMenu = ({ options, onSelect, type }) => {
  return (
    <div
      className={classnames(
        style.burgerMenu,
        "marginR20",
        "marginT15",
        type === DROPDOWN_TYPES.HELP ? "helpDropdownStyle" : "menuDropdownStyle"
      )}
    >
      <Dropdown
        className={style.icon}
        caretPosition="right"
        customIcon={type === DROPDOWN_TYPES.HELP ? "help" : "menu"}
        options={options}
        id={type === DROPDOWN_TYPES.HELP ? "help_dropdown" : "menu_dropdown"}
        onSelect={onSelect}
        closeOnSelect={type === DROPDOWN_TYPES.HELP ? false : true}
      />
    </div>
  );
};

BurgerMenu.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  type: PropTypes.any
};

class Header extends Component {
  static propTypes = {
    company: PropTypes.object.isRequired,
    accessLinks: PropTypes.array.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    addedOn: PropTypes.number,
    logout: PropTypes.func.isRequired,
    moreLearningSites: PropTypes.bool,
    activeTab: PropTypes.oneOf(Object.values(CONTENT_ACCESS_TAB_NAME)),
    features: PropTypes.object,
    permissions: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    userId: PropTypes.string
  };

  static defaultProps = {
    accessLinks: []
  };

  getBurgerMenuOptions = () => {
    const { features, moreLearningSites, permissions } = this.props;
    return getBurgerMenuOptions({
      features,
      moreLearningSites,
      permissions
    }).map(options => {
      let subtext = "";
      if (options.value === BURGER_MENU_KEY.VIEW_LS) {
        subtext = this.props.company.url;
      }
      return {
        value: options.value,
        element: (
          <UserDropdownMenuItem
            key={options.value}
            text={options.text}
            subtext={subtext}
            onSubTextClick={this.handleSubtextSelect}
          />
        )
      };
    });
  };

  getHelpDropdownOptions = () => {
    //const { email } = this.props;

    return HELP_MENU_OPTIONS.map(options => {
      let subtext = "";
      let element = (
        <UserDropdownMenuItem
          key={options.value}
          text={options.text}
          subtext={subtext}
          onSubTextClick={this.handleSubtextSelect}
        />
      );
      if (options.value === HELP_MENU_KEY.REPORT_ISSUE) {
        element = {
          /*<GetSupport
            key={options.value}
            initiator={options.text}
            email={email}
            onClose={noop}
          />*/
        };
      }
      if (options.value === HELP_MENU_KEY.GUIDE_ME) {
        element = (
          <div key={options.value} id="mt-appcues-widget">
            <div id="appcues-icon" className="appcues-widget-icon">
              {" "}
              Guide Me
            </div>
          </div>
        );
      }

      return {
        value: options.value,
        element
      };
    });
  };

  handleSubtextSelect = (event, subtext) => {
    event.stopPropagation();
    openWindow(subtext);
  };

  handleDropdownSelect = (value, event) => {
    event.stopPropagation();
    let url = null;
    switch (value) {
      case BURGER_MENU_KEY.SETTING:
        url = getStaticUrl(ACCESS_LINK_URL.ACCOUNT_SETTING);
        reload(url);
        break;
      case BURGER_MENU_KEY.SWITCH_LS:
        url = getStaticUrl(ACCESS_LINK_URL.SWITCH_LS);
        reload(url);
        break;
      case BURGER_MENU_KEY.VIEW_AR:
        url = getStaticUrl(ACCESS_LINK_URL.AUTOMATION_RULES);
        reload(url);
        break;
      case BURGER_MENU_KEY.VIEW_PMH:
        url = getStaticUrl(ACCESS_LINK_URL.PROFILE_FIELD_MANAGEMENT);
        reload(url);
        break;
      case BURGER_MENU_KEY.MANAGE_TAGS:
        url = getStaticUrl(ACCESS_LINK_URL.MANAGE_TAGS);
        reload(url);
        break;
      case PROFILE_KEY.PROFILE:
        url = getStaticUrl(ACCESS_LINK_URL.PROFILE);
        reload(url);
        break;
      case PROFILE_KEY.SIGN_OUT:
        this.props.logout();
        break;
      case HELP_MENU_KEY.HELP_CENTER:
        url = getStaticUrl(ACCESS_LINK_URL.HELP_CENTER);
        openWindow(url);
        break;
    }
  };

  getUserAcronym = () => {
    let acronym = "--";
    const { name, email } = this.props;
    if (name) return getAcronym(name);
    if (email) return getAcronym(email);
    return acronym;
  };

  componentDidMount() {
    const { userId, company, name, email, addedOn } = this.props;
    if (window.Appcues && typeof window.Appcues.identify === "function") {
      window.Appcues.identify(userId, {
        cname: company.id,
        name: name ? name : email,
        created_at: addedOn
      });

      let widget = window.AppcuesWidget(window.Appcues.user());
      widget.init("#mt-appcues-widget", {
        position: "bottom-left"
      });
    }
  }

  render() {
    //const burgerMenuOptions = this.getBurgerMenuOptions();
    // const helpMenuOptions = this.getHelpDropdownOptions();

    //const userTitle = this.getUserAcronym();
    const {
      accessLinks,
      activeTab,
      match: {
        params: { moduleId, seriesId }
      }
    } = this.props;

    return [
      <div className={style.header} key="header">
        <ContentAccessLinks items={accessLinks} activeTab={activeTab} />
        <div className={style.headerRight} key="headerRight">
          {this.props.features.showSmartInsights && (
            <Insights
              className={classnames(style.viewInsights, "marginR20", "marginT15")}
              moduleId={moduleId}
              seriesId={seriesId}
            />
          )}
          {/* <GetHelp
            className={classnames("marginR20", "marginT15")}
            email={email}
          />*/}
          {/*<BurgerMenu
            options={helpMenuOptions}
            onSelect={this.handleDropdownSelect}
            type={DROPDOWN_TYPES.HELP}
          />*/}
          {/*<BurgerMenu
            options={burgerMenuOptions}
            onSelect={this.handleDropdownSelect}
          />
          <UserProfile
            items={USER_PROFILE_OPTIONS}
            title={userTitle}
            onSelect={this.handleDropdownSelect}
          />*/}
        </div>
      </div>
    ];
  }
}

export default withRouter(Header);
