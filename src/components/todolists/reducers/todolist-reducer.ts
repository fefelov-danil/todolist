import {FilterValuesType, ResultCode, TodolistDomainType, todoListsAPI} from "api/todoListsAPI";
import {RequestStatusType, setAppStatus,} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const fetchTodoListsTC = createAsyncThunk('todoLists/fetchTodoLists',
    async (payload, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus('loading'))
        try {
            const res = await todoListsAPI.getTodoLists()
            dispatch(setAppStatus('succeeded'))
            return res.data
        } catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            handleServerNetworkAppError(dispatch, error)
            return rejectWithValue(null)
        }
    })
export const addTodolistTC = createAsyncThunk('todoLists/addTodolist',
    async (title: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus('loading'))
        try {
            const res = await todoListsAPI.createTodoList(title)
            if (res.data.resultCode === ResultCode.SUCCESSFUL) {
                dispatch(setAppStatus('succeeded'))
                return res.data.data.item
            } else {
                handleServerAppError(dispatch, res.data)
                return rejectWithValue(null)
            }
        } catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            handleServerNetworkAppError(dispatch, error)
            return rejectWithValue(null)
        }
    })
export const removeTodolistTC = createAsyncThunk('todoLists/removeTodolist',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodoListEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
        try {
            const res = await todoListsAPI.deleteTodoList(todolistId)
            dispatch(setAppStatus('succeeded'))
            return todolistId
        } catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            handleServerNetworkAppError(dispatch, error)
            return rejectWithValue(null)
        }
    })
export const changeTodolistTitleTC =
    createAsyncThunk('todoLists/changeTodolist',
        async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
            dispatch(setAppStatus('loading'))
            dispatch(changeTodoListEntityStatusAC({id: param.todolistId, entityStatus: 'loading'}))
            try {
                const res = await todoListsAPI.updateTodoList(param.todolistId, param.title)
                if (res.data.resultCode === ResultCode.SUCCESSFUL) {
                    dispatch(setAppStatus('idle'))
                    dispatch(changeTodoListEntityStatusAC({id: param.todolistId, entityStatus: 'idle'}))
                    return {title: param.title, id: param.todolistId}
                } else {
                    handleServerAppError(dispatch, res.data)
                    return rejectWithValue(null)
                }
            } catch (e) {
                const error = e as Error | AxiosError<{ error: string }>
                handleServerNetworkAppError(dispatch, error)
                return rejectWithValue(null)
            }
        })


const slice = createSlice({
    name: 'todoLists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodoListFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodoListEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
            return action.payload.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload, filter: 'all', entityStatus: "idle"})
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload)
            state.splice(index, 1)
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload?.id)
            state[index].title = action.payload.title
        })
    }
})

export const todoListsReducer = slice.reducer
export const {
    changeTodoListFilterAC,
    changeTodoListEntityStatusAC
} = slice.actions