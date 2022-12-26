import * as todosSelectors from 'features/todolists/selectors'
import {tasksAsyncActions as tasksActions} from 'features/todolists/reducers/tasks-reducer'
import {todoListsAsyncActions} from 'features/todolists/reducers/todolists-reducer'
import {sliceTodoListsReducer} from 'features/todolists/reducers/todolists-reducer'
import {todoListsReducer} from 'features/todolists/reducers/todolists-reducer'
import {tasksReducer} from 'features/todolists/reducers/tasks-reducer'
import {TodoLists} from 'features/todolists/TodoLists'

const todoListsActions = {
  ...todoListsAsyncActions,
  ...sliceTodoListsReducer.actions
}

export {
  todosSelectors,
  tasksActions,
  todoListsActions,
  todoListsReducer,
  tasksReducer,
  TodoLists
}