import {v1} from "uuid";
import {AnyAction, Dispatch} from "redux";
import {FilterValuesType, TodolistDomainType, todoListsAPI, TodoListType} from "api/todoListsAPI";

const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType>  => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todoLists.map(tl => ({...tl, filter: 'all'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            return state;
    }
}

// Actions
export const removeTodoListAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolistAC = (todolist: TodoListType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodoListTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodoListsAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOS', todoLists} as const)

// Thunks
export const fetchTodoListsThunk = () => (dispatch: Dispatch) => {
    todoListsAPI.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todoListsAPI.createTodoList(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todoListsAPI.deleteTodoList(todolistId)
        .then(() => {
            dispatch(removeTodoListAC(todolistId))
        })
}
export const changeTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todoListsAPI.updateTodoList(todolistId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(todolistId, title))
        })
}

// Types
export type SetTodoListsAT = ReturnType<typeof setTodoListsAC>
export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type ChangeTodoListFilterAT = ReturnType<typeof changeTodoListFilterAC>
export type ChangeTodoListTitleAT = ReturnType<typeof changeTodoListTitleAC>

export type ActionType = SetTodoListsAT
    | RemoveTodoListAT
    | AddTodoListAT
    | ChangeTodoListFilterAT
    | ChangeTodoListTitleAT