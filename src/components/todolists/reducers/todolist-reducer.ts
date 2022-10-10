import {Dispatch} from "redux";
import {FilterValuesType, ResultCode, TodolistDomainType, todoListsAPI, TodoListType} from "api/todoListsAPI";
import {RequestStatusType, setAppStatusAC,} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todoLists',
    initialState: initialState,
    reducers: {
        setTodoListsAC(state, action: PayloadAction<Array<TodoListType>>) {
            return action.payload.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        },
        removeTodoListAC(state, action: PayloadAction<string>) {
            const index = state.findIndex(tl => tl.id === action.payload)
            if (index > -1) state.splice(index, 1)
        },
        addTodolistAC(state, action: PayloadAction<TodoListType>) {
            state.unshift({...action.payload, filter: 'all', entityStatus: "idle"})
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodoListFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodoListEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        }
    }
})

export const todoListsReducer = slice.reducer
export const {
    setTodoListsAC,
    removeTodoListAC,
    addTodolistAC,
    changeTodoListTitleAC,
    changeTodoListFilterAC,
    changeTodoListEntityStatusAC
} = slice.actions

// Thunks
export const fetchTodoListsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.getTodoLists()
        .then(response => {
            dispatch(setTodoListsAC(response.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.createTodoList(title)
        .then((response) => {
            if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                dispatch(addTodolistAC(response.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, response.data)
            }
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListEntityStatusAC({ id: todolistId, entityStatus:  'loading' }))
    todoListsAPI.deleteTodoList(todolistId)
        .then(() => {
            dispatch(removeTodoListAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const changeTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListEntityStatusAC({ id: todolistId, entityStatus:  'loading' }))
    todoListsAPI.updateTodoList(todolistId, title)
        .then((response) => {
            if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                dispatch(changeTodoListTitleAC({title, id: todolistId}))
                dispatch(setAppStatusAC('idle'))
                dispatch(changeTodoListEntityStatusAC({ id: todolistId, entityStatus:  'idle' }))
            } else {
                handleServerAppError(dispatch, response.data)
            }
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}