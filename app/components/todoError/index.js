import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import Icon from "@components/icon";

import style from "./index.scss";

const TodoError = ({ todoCount, openTodos }) => (
  <div className={style.todoError}>
    <Icon type="todo" className={classnames("marginR10", style.icon)} />
    <span>
      <span>You need to complete </span>
      <span onClick={openTodos} className={style.itemCount}>
        {`${todoCount} item${todoCount > 1 ? "s" : ""}`}
      </span>
      <span> in the To-Do list to Publish this Module.</span>
    </span>
  </div>
);

TodoError.propTypes = {
  todoCount: PropTypes.number,
  openTodos: PropTypes.func
};

export default TodoError;
