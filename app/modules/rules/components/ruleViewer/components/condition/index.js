import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import Identifier from "../identifier";

// utils
import { getGroupingDisplayName, getOperatorDisplayName } from "../../utils";

import { TYPE_TO_GROUP_CONFIG, CONDITION_TYPES } from "../../constants";

import style from "./index.scss";

const GROUP_STYLES = [
  classname(style.group, style.alignStart),
  classname(style.group, style.group2, style.groupBlock, style.barLeft)
];

class BaseCondition extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.keys(CONDITION_TYPES)).isRequired,
    condition: PropTypes.object
  };

  PROPERTY_TO_RENDERER = {
    description: () => <div className={style.block}>{this.props.condition.description}</div>,
    identifiers: iden => this.renderIdentifiers(iden),
    triads: triads => this.renderTriads(triads)
  };

  renderTriad = ({ operator, dataType, literal, field }, index) => {
    return (
      <li key={`triad-${index}`} className={classname(style.triad, style.block)}>
        <div>{field}</div>
        <div className={style.triadOperator}>{getOperatorDisplayName(operator, dataType)}</div>
        <div>{literal}</div>
      </li>
    );
  };

  renderIdentifier = (identifier, index) => (
    <Identifier key={`identifier-${index}`} {...identifier} />
  );

  renderGrouping = grouping => (
    <div className={classname(style.block)}>{getGroupingDisplayName(grouping)}</div>
  );

  renderIdentifiers() {
    const { identifiers } = this.props.condition;
    if (identifiers) {
      const { grouping, data } = identifiers;
      const hasGrouping = data.length > 1 && grouping;
      if (hasGrouping) {
        return [
          this.renderGrouping(grouping),
          <ul key="identifierList" className={classname(style.itemsBlock)}>
            {data.map(this.renderIdentifier)}
          </ul>
        ];
      }
      return <ul>{data.map(this.renderIdentifier)}</ul>;
    }
  }

  renderTriads() {
    const { triads } = this.props.condition;
    const { data, grouping } = triads;
    const hasGrouping = data.length > 1;
    if (hasGrouping) {
      return [
        this.renderGrouping(grouping),
        <ul key="triadList" className={classname(style.itemsBlock)}>
          {data.map(this.renderTriad)}
        </ul>
      ];
    }
    return <ul>{data.map(this.renderTriad)}</ul>;
  }

  renderGroup = (property, index) => {
    const renderer = this.PROPERTY_TO_RENDERER[property];
    return (
      <div key={`cond-group-${index}`} className={GROUP_STYLES[index]}>
        {renderer()}
      </div>
    );
  };

  render() {
    return (
      <li className={style.baseCondition}>
        {TYPE_TO_GROUP_CONFIG[this.props.type].map(this.renderGroup)}
        <div className={classname(style.block, style.conditionGrouping)}>AND</div>
      </li>
    );
  }
}

export default BaseCondition;
