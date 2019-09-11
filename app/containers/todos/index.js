import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import { injectReducer, injectSaga, getActions } from "@core/helpers";

import saga from "./saga";
import reducer from "./reducer";
import { GET_TODOS, TOGGLE_TODOS } from "./actionTypes";
import TodoItem from "./components/todoItem";
import Dropdown from "@components/dropdown";

import style from "./index.scss";

const NoTodo = () => {
  return <span key="no_todos">No pending to-do</span>;
};
const TodoHeader = ({ todos }) => {
  return (
    <div className={style.todosHeading} key="todo_heading">
      To-Do List {todos.length ? `(${todos.length})` : ""}
    </div>
  );
};
TodoHeader.propTypes = {
  todos: PropTypes.array
};
TodoHeader.defaultProps = {
  todos: []
};

class Todos extends Component {
  static propTypes = {
    className: PropTypes.string,
    target: PropTypes.node.isRequired,
    todos: PropTypes.array,
    show: PropTypes.bool,
    reset: PropTypes.func.isRequired,
    toggleShow: PropTypes.func.isRequired,
    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    history: PropTypes.object.isRequired,
    baseUrl: PropTypes.string.isRequired,
    moduleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    getTodos: PropTypes.func.isRequired
  };

  static defaultProps = {
    todos: [],
    show: false
  };

  onTargetClick = () => {
    this.props.toggleShow(!this.props.show);
  };
  generateTodoListOptions = ({ todos, baseUrl }) => {
    let options = [];

    options = todos.reduce((options, todo) => {
      todo.errors.forEach(errorCode => {
        options.push({
          element: <TodoItem key={todo.id} errorCode={errorCode} />,
          value: `${baseUrl}/${todo.id}`
        });
      });
      return options;
    }, []);

    options = options.length
      ? options
      : [
          {
            element: <NoTodo />
          }
        ];

    options.unshift({
      element: <TodoHeader todos={todos} />,
      header: true
    });
    return options;
  };
  componentWillReceiveProps(newProps) {
    const { show: newShowState, moduleId, seriesId, getTodos, toggleShow } = newProps;
    const { show: oldShowState } = this.props;
    if (oldShowState !== newShowState) {
      if (oldShowState) {
        toggleShow(false);
      } else {
        getTodos({ moduleId, seriesId });
      }
    }
  }
  render() {
    const { todos, baseUrl, loaded, show, target, history } = this.props;
    return (
      <div className={classnames(this.props.className, style.todosWrapper)}>
        <div key="target" onClick={this.onTargetClick}>
          {target}
        </div>
        {show && (
          <Dropdown
            noCaret={true}
            show={show}
            onSelect={value => value && history.replace(value)}
            className={style.todoContainer}
            onToggle={this.onTargetClick}
            loading={!loaded}
            options={this.generateTodoListOptions({ todos, baseUrl, loaded })}
            id="todos"
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { loaded, isLoading, hasError, data: todos, show } = state.moduleTodos;
  const { moduleId, seriesId, className, target, baseUrl } = ownProps;
  return {
    className,
    loaded,
    isLoading,
    hasError,
    todos,
    show,
    moduleId,
    seriesId,
    target,
    baseUrl
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getTodos: ({ moduleId, seriesId, companyId }) =>
      dispatch(getActions(GET_TODOS)({ moduleId, seriesId, companyId })),
    toggleShow: show => {
      dispatch(getActions(TOGGLE_TODOS)({ show }));
      if (!show) {
        const { RESET } = getActions({
          name: GET_TODOS,
          options: { async: true }
        });
        dispatch(RESET());
      }
    },
    reset: () => {}
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "moduleTodos", reducer });
const withSaga = injectSaga({ name: "moduleTodos", saga });

export const showTodos = () => {
  return getActions(TOGGLE_TODOS)({ show: true });
};
export const hideTodos = () => {
  return getActions(TOGGLE_TODOS)({ show: false });
};

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect
)(Todos);
