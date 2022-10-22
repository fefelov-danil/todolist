import {RootState} from "app/store";

export const selectTodoLists = (state: RootState) => state.todoLists
export const selectTasks = (state: RootState) => state.tasks