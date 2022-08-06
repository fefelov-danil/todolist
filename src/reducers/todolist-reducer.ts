import {Dispatch} from "redux";
import {FilterValuesType, ResultCode, TodolistDomainType, todoListsAPI, TodoListType} from "api/todoListsAPI";
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "app/app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType>  => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return state;
    }
}

// Actions
export const removeTodoListAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolistAC = (todolist: TodoListType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodoListTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const changeTodoListEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const)
export const setTodoListsAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOS', todoLists} as const)

// Thunks
export const fetchTodoListsThunk = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.getTodoLists()
        .then(response => {
            dispatch( setTodoListsAC(response.data))
            dispatch( setAppStatusAC('succeeded'))
        } )
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.createTodoList(title)
        .then((response) => {
            if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                dispatch( addTodolistAC(response.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (response.data.messages.length) {
                    dispatch(setAppErrorAC(response.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        } )
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListEntityStatusAC(todolistId, 'loading'))
    todoListsAPI.deleteTodoList(todolistId)
        .then(() => {
            dispatch(removeTodoListAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodoListEntityStatusAC(todolistId, 'idle'))
        } )
}
export const changeTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.updateTodoList(todolistId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(todolistId, title))
            dispatch(setAppStatusAC('idle'))
        } )
}

// Types
export type SetTodoListsAT = ReturnType<typeof setTodoListsAC>
export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type ChangeTodoListEntityStatusAT = ReturnType<typeof changeTodoListEntityStatusAC>

type ActionsType = SetTodoListsAT
    | RemoveTodoListAT
    | AddTodoListAT
    | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ChangeTodoListEntityStatusAT
    | AppActionsType