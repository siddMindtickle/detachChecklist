import { get } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";

const TodoService = {};

const parseTodos = (todos = {}) => {
  const { id, childErrors, objectType: type, errorCodes = [], name } = todos;
  const parsedTodos = [];
  if (errorCodes && Array.isArray(errorCodes) && errorCodes.length) {
    parsedTodos.push({
      id,
      type,
      name,
      errors: [...errorCodes]
    });
  }
  if (childErrors && Array.isArray(childErrors)) {
    childErrors.forEach(childTodo => {
      parsedTodos.push(...parseTodos(childTodo));
    });
  }
  return parsedTodos;
};

TodoService.getTodos = async ({ moduleId, seriesId }) => {
  const { todos = {} } = await get(
    ApiUrls.getTodos({
      moduleId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return parseTodos(todos);
};

export default TodoService;
