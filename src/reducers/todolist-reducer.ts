import {v1} from "uuid";
import {FilterValuesType, TodolistType} from "../AppWithRedux";

export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type ChangeTodoListFilterAT = ReturnType<typeof changeTodoListFilterAC>
export type ChangeTodoListTitleAT = ReturnType<typeof changeTodoListTitleAC>

export type ActionType = RemoveTodoListAT
    | AddTodoListAT
    | ChangeTodoListFilterAT
    | ChangeTodoListTitleAT

const initialState: Array<TodolistType> = []

export const todolistsReducer = (state: Array<TodolistType> = initialState, action: ActionType): Array<TodolistType>  => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            const newTodoList: TodolistType = {
                id: action.todolistId,
                title: action.title,
                filter: "all"
            }
            return [newTodoList, ...state]
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todolistId
                ? {...tl, filter: action.filter}
                : tl
            )
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId
                ? {...tl, title: action.title}
                : tl
            )
        default:
            return state
    }
}

export const removeTodoListAC = (todolistId: string) => {
    return {type: "REMOVE-TODOLIST", todolistId} as const
}
export const changeTodoListFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return {type: "CHANGE-TODOLIST-FILTER", todolistId, filter} as const
}
export const addTodolistAC = (title: string) => {
    return {type: "ADD-TODOLIST", todolistId: v1(), title} as const
}
export const changeTodoListTitleAC = (todolistId: string, title: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", todolistId, title} as const
}