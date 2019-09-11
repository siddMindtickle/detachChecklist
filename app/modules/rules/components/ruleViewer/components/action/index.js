import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

// components
import Identifier from "../identifier";

// utils
import { getActionDisplayName } from "../../utils";

// styles
import style from "../../index.scss";

class Action extends Component {
  static propTypes = {
    action: PropTypes.object
  };

  renderIdentifier = (identifier, index) => <Identifier key={`ac-id-${index}`} {...identifier} />;

  render() {
    const {
      operation,
      entityType,
      identifiers: { data: identifiers }
    } = this.props.action;
    return (
      <li className={style.ruleBlock}>
        <div className={classname(style.block)}>{getActionDisplayName(entityType, operation)}</div>
        <div className={classname(style.group2, style.barLeft)}>
          <ul className={style.itemsBlock}>{identifiers.map(this.renderIdentifier)}</ul>
        </div>
      </li>
    );
  }
}

export default Action;
