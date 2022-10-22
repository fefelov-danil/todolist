import {TodolistDomainType, TodoListType} from "api/todoListsAPI";
import {addTodolistTC, todoListsReducer} from "components/todolists/todolists-reducer";
import {tasksReducer, TasksStateType} from "components/todolists/tasks-reducer";

let startTasksState: TasksStateType
let startTodoListsState: Array<TodolistDomainType>
let todolist: TodoListType

beforeEach(() => {
    startTasksState = {}
    startTodoListsState = []
    todolist = {id: 'todolistId1', title: 'Todo1', order: 0, addedDate: ''}
})

test('ids should be equals', () => {
    const action = addTodolistTC.fulfilled(todolist, '', 'Title1')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodoListsState, action)

    const keysOfTasksState = Object.keys(endTasksState)

    expect(keysOfTasksState[0]).toBe(endTodolistsState[0].id)
    expect(keysOfTasksState[0]).toBe(action.payload?.id)
})