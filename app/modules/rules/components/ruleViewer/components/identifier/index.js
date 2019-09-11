import React from "react";
import PropTypes from "prop-types";
import classname from "classnames";

// components
import ModuleIcon, { ICON_SIZES } from "@components/moduleIcon";
import IdentifierIcon from "../identifierIcon";

// styles
import style from "./index.scss";

// constants
import { IDENTIFIER_TYPES } from "../../constants";

const getDisplayNameByType = ({ type, ...data }) => {
  switch (type) {
    case IDENTIFIER_TYPES.MODULE:
      return (
        <div className={style.alignCenter}>
          {data.moduleType && (
            <ModuleIcon
              className="ruleModuleIcon"
              moduleType={data.moduleType}
              size={ICON_SIZES.SMALL}
            />
          )}
          {data.moduleName}
          {data.seriesName && (
            <span>
              {" in"}
              <IdentifierIcon type={IDENTIFIER_TYPES.SERIES} />
              {data.seriesName}
            </span>
          )}
        </div>
      );
    case IDENTIFIER_TYPES.TAG:
      return (
        <div className={style.alignCenter}>
          {`${data.desc} `}
          <IdentifierIcon type={type} />
          <b>{`${data.tagName}`}</b>
        </div>
      );
    case IDENTIFIER_TYPES.GROUP:
      return (
        <div className={style.alignCenter}>
          <IdentifierIcon type={type} />
          {data.groupName}
        </div>
      );
    case IDENTIFIER_TYPES.SERIES:
      return (
        <div className={style.alignCenter}>
          <IdentifierIcon type={type} />
          {data.seriesName}
        </div>
      );
  }
};

const Identifier = props => (
  <li className={classname(style.block, style.identifier)}>{getDisplayNameByType(props)}</li>
);

Identifier.propTypes = {
  type: PropTypes.string.isRequired
};

export default Identifier;
