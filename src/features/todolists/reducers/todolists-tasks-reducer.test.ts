import {todoListsReducer} from "features/todolists/reducers/todolists-reducer";
import {tasksReducer, TasksStateType} from "features/todolists/reducers/tasks-reducer";
import {todoListsActions} from 'features/todolists/index';
import {TodolistDomainType, TodoListType} from "api/todoListsAPI";

let startTasksState: TasksStateType
let startTodoListsState: Array<TodolistDomainType>
let todolist: TodoListType

beforeEach(() => {
  startTasksState = {}
  startTodoListsState = []
  todolist = {id: 'todolistId1', title: 'Todo1', order: 0, addedDate: ''}
})

test('ids should be equals', () => {
  const action = todoListsActions.addTodolist.fulfilled(todolist, '', 'Title1')

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todoListsReducer(startTodoListsState, action)

  const keysOfTasksState = Object.keys(endTasksState)

  expect(keysOfTasksState[0]).toBe(endTodolistsState[0].id)
  expect(keysOfTasksState[0]).toBe(action.payload?.id)
})