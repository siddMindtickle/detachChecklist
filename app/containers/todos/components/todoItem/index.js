import React from "react";
import PropTypes from "prop-types";

import Icon from "@components/icon";
import classnames from "classnames";
import TODO_MESSAGES from "../../config/todoMessages";

import style from "./index.scss";

const TodoItem = ({ errorCode }) => {
  return (
    <div className="clearfix">
      <Icon type="right_arrow_wide" className={style.todosRightArrow} />
      <span className={classnames("link", style.todoText)}>
        {TODO_MESSAGES[errorCode] || errorCode}
      </span>
    </div>
  );
};
TodoItem.propTypes = {
  errorCode: PropTypes.string.isRequired
};

export default TodoItem;
