import {
    changeTodoListEntityStatus, changeTodoListFilter, todoListsReducer
} from "components/todolists/todolists-reducer";
import {TodolistDomainType, TodoListType} from "api/todoListsAPI";
import {todoListsActions} from 'components/todolists/index';

let startState: Array<TodolistDomainType>
let initialState: Array<TodolistDomainType>
let todoLists: Array<TodoListType>
let todolist: TodoListType


beforeEach(() => {
    startState = [
        {id: 'todolistId1', title: 'Todo1', order: 0, addedDate: '', entityStatus: "idle", filter: "all"},
        {id: 'todolistId2', title: 'Todo2', order: 0, addedDate: '', entityStatus: "idle", filter: "all"},
        {id: 'todolistId3', title: 'Todo3', order: 0, addedDate: '', entityStatus: "idle", filter: "all"}
    ]
    initialState = []
    todoLists = [
        {id: 'todolistId1', title: 'Todo1', order: 0, addedDate: ''},
        {id: 'todolistId2', title: 'Todo2', order: 0, addedDate: ''},
        {id: 'todolistId3', title: 'Todo3', order: 0, addedDate: ''}
    ]
    todolist = {id: 'todolistId0', title: 'Todo0', order: 0, addedDate: ''}
})

test('Add todoLists to initial state', () => {
    const action = todoListsActions.fetchTodoLists.fulfilled(todoLists, '')

    const endState = todoListsReducer(initialState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].id).toBe('todolistId1')
    expect(endState[2].title).toBe('Todo3')
    expect(endState[3]).toBeUndefined()
})
test('Deleting a todoList', () => {
    const action = todoListsActions.removeTodolist.fulfilled('todolistId2', '', 'todolistId2')

    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].id).toBe('todolistId1')
    expect(endState[1].id).toBe('todolistId3')
    expect(endState[2]).toBeUndefined()
})
test('Adding a todoList', () => {
    const action = todoListsActions.addTodolist.fulfilled(todolist, '', 'Title1')

    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(4)
    expect(endState[0].id).toBe('todolistId0')
    expect(endState[1].id).toBe('todolistId1')
})
test('Change todoList title', () => {
    const action = todoListsActions.changeTodolistTitle.fulfilled({id: 'todolistId3', title: 'New title'}, '', {
        todolistId: 'todolistId3',
        title: 'New title'
    })

    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe('New title')
    expect(endState[0].title).toBe('Todo1')
    expect(endState[1].title).toBe('Todo2')
})
test('Change todoList filter', () => {
    const action = changeTodoListFilter({id: 'todolistId1', filter: 'active'})

    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].filter).toBe('active')
    expect(endState[1].filter).toBe('all')
    expect(endState[2].filter).toBe('all')
})
test('Change todoList entity status', () => {
    const action = changeTodoListEntityStatus({id: 'todolistId1', entityStatus: 'succeeded'})

    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].entityStatus).toBe('succeeded')
    expect(endState[1].entityStatus).toBe('idle')
    expect(endState[2].entityStatus).toBe('idle')
})