import * as todosSelectors from './selectors'
import {tasksAsyncActions as tasksActions} from './tasks-reducer'
import {todoListsAsyncActions} from './todolists-reducer'
import {sliceTodoListsReducer} from './todolists-reducer'
import {TodoLists} from './TodoLists'

const todoListsActions = {
    ...todoListsAsyncActions,
    ...sliceTodoListsReducer.actions
}

export {
    todosSelectors,
    tasksActions,
    todoListsActions,
    TodoLists
}