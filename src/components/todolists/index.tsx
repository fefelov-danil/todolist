import * as todosSelectors from './selectors'
import {tasksAsyncActions as tasksActions} from 'components/todolists/reducers/tasks-reducer'
import {todoListsAsyncActions} from 'components/todolists/reducers/todolists-reducer'
import {sliceTodoListsReducer} from 'components/todolists/reducers/todolists-reducer'
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