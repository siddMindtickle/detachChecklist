import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { injectIntl, FormattedMessage } from "react-intl";
import { Menu, Layout, Tooltip } from "antd";
import Icon from "@mindtickle/mt-ui-components/Icon";
import InnerHTML from "@components/innerHTML";
import MtButton from "@uielements/button";

import { isEmpty } from "@utils";

import { OVERVIEW_ID } from "@config/env.config";
import style from "./index.scss";

const { Sider } = Layout;

const getSectionId = data => {
  return data.map(({ id }) => id.toString());
};

const LeafStateButton = ({ node, lockedMessage }) => {
  const { isLocked, isCompleted } = node;
  const iconClass = classNames("floatR", "F16", "marginT12", "pos_rel", "paddingL1", "paddingR1");
  return (
    <MtButton className="floatR cursor" style={{ padding: "0" }} type="noborderPrimary" ghost>
      <div className={iconClass}>
        {isLocked && (
          <Tooltip title={lockedMessage}>
            <div className="pos_abs" style={{ width: "100%", height: "100%", top: 0, left: 0 }} />
          </Tooltip>
        )}
      </div>
      {!isLocked && !isCompleted ? (
        <Icon className={`F16 ${style.taskIcon}`} type={"confirmOutline"} />
      ) : null}
      {!isLocked && isCompleted ? (
        <Icon className={"F16 completedColor "} type={"Confirm"} />
      ) : null}
      {isLocked && !isCompleted ? <Icon className={style.locked} type={"locked"} /> : null}
      {isLocked && isCompleted ? <Icon className={style.lockedCompleted} type={"locked"} /> : null}
    </MtButton>
  );
};
LeafStateButton.propTypes = {
  node: PropTypes.object.isRequired,
  lockedMessage: PropTypes.string.isRequired
};

class SideBar extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedId: PropTypes.string,
    lockedMessage: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    selectedId: OVERVIEW_ID
  };

  state = {
    openNodeIds: getSectionId(this.props.data)
  };

  leafNode = (node, { lockedMessage }) => {
    const { id, name, isLocked, orderIndex, frozen } = node;
    return (
      <Menu.Item key={id} className="sidebarListItem" disabled={isLocked || frozen}>
        <LeafStateButton node={node} lockedMessage={lockedMessage} />
        <div className="ellipsis" style={{ marginRight: "30px" }}>
          {orderIndex}. {name}
        </div>
        <div className="clear" />
      </Menu.Item>
    );
  };

  parentNode = (node, { lockedMessage }) => {
    const { name, id, children } = node;
    return (
      <Menu.SubMenu key={id} title={name}>
        {children.map(childNode => {
          if (childNode.children) {
            return this.parentNode(childNode);
          } else {
            return this.leafNode(childNode, { lockedMessage });
          }
        })}
      </Menu.SubMenu>
    );
  };

  overviewNode = node => {
    const { id, name } = node;
    return (
      <Menu.Item key={id} className={style.overviewItem}>
        <div className="F13">
          <div className={classNames("floatL marginR5 F13 blackColor bold")}>
            <FormattedMessage id="OVERVIEW" /> :
          </div>

          {!!name && [
            <div key="overviewArrow" className={classNames("floatR F13 blackColor ")}>
              <Icon type={"right_arrow"} className={"marginL8"} />
            </div>,
            <div key="overviewDescription" className={style.sidebarMenu}>
              <InnerHTML id="description_html" content={name ? name : ""} />
            </div>
          ]}
          <div className="clear" />
        </div>
      </Menu.Item>
    );
  };

  emptySearch = () => {
    return (
      <div className="F13 lineHeight20 textalign_C marginT30" style={{ color: "#000" }}>
        <div className="bold F16">No Results Found</div>
        <div>Try Searching for diffferent key word</div>
      </div>
    );
  };

  getChildren = () => {
    const { data, ...rest } = this.props;
    const parsedResult = data.map(node => {
      if (node.id == OVERVIEW_ID) {
        return this.overviewNode(node);
      } else if (node.children && !isEmpty(node.children)) {
        return this.parentNode(node, rest);
      } else {
        return this.leafNode(node, rest);
      }
    });
    if (parsedResult.length <= 1) parsedResult.push(this.emptySearch());
    return parsedResult;
  };

  render() {
    const { onSelect, selectedId, className } = this.props;
    const { openNodeIds } = this.state;
    return (
      <Sider width={"100%"} className={className}>
        <Menu
          onClick={({ key }) => onSelect(key)}
          selectedKeys={[selectedId]}
          openKeys={openNodeIds}
          onOpenChange={openNodeIds => {
            this.setState({ openNodeIds });
          }}
          mode="inline"
        >
          {this.getChildren()}
        </Menu>
      </Sider>
    );
  }
}

export default injectIntl(SideBar);
