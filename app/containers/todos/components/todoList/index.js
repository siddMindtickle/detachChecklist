import React from "react";
import PropTypes from "prop-types";
import TodoItem from "../../components/todoItem";
const TodoList = ({ todos, baseUrl }) => {
  return (
    <ul>
      {todos.map(todo => {
        return todo.errors.map(errorCode => {
          return <TodoItem key={todo.id} link={`${baseUrl}/${todo.id}`} errorCode={errorCode} />;
        });
      })}
    </ul>
  );
};
TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  baseUrl: PropTypes.string.isRequired
};

export default TodoList;
