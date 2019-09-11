import React from "react";
import PropTypes from "prop-types";

// constants
import { IDENTIFIER_TYPES } from "../../constants";

// styles
import style from "./index.scss";

// assets
import series from "../../../../assets/series.svg";
import tag from "../../../../assets/tags.svg";
import group from "../../../../assets/group.svg";

const IDENTIFIER_TYPE_TO_ICON = {
  [IDENTIFIER_TYPES.TAG]: tag,
  [IDENTIFIER_TYPES.GROUP]: group,
  [IDENTIFIER_TYPES.SERIES]: series
};

const IdentifierIcon = ({ type }) => (
  <img src={IDENTIFIER_TYPE_TO_ICON[type]} className={style.blockImage} />
);

IdentifierIcon.propTypes = {
  type: PropTypes.oneOf(Object.values(IDENTIFIER_TYPES))
};

export default IdentifierIcon;
