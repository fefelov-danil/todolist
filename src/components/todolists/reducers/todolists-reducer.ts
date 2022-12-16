import {FilterValuesType, ResultCode, TodolistDomainType, todoListsAPI} from "api/todoListsAPI";
import {RequestStatusType, setAppStatus,} from "app/reducers/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "features/utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

const fetchTodoLists = createAsyncThunk('todoLists/fetchTodoLists',
  async (payload, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    try {
      const res = await todoListsAPI.getTodoLists()
      dispatch(setAppStatus('succeeded'))
      return res.data
    } catch (e) {
      handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
      return rejectWithValue(null)
    }
  })
const addTodolist = createAsyncThunk('todoLists/addTodolist',
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
      handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
      return rejectWithValue(null)
    }
  })
const removeTodolist = createAsyncThunk('todoLists/removeTodolist',
  async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodoListEntityStatus({id: todolistId, entityStatus: 'loading'}))
    try {
      await todoListsAPI.deleteTodoList(todolistId);
      dispatch(setAppStatus('succeeded'))
      return todolistId
    } catch (e) {
      handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
      return rejectWithValue(null)
    }
  })
const changeTodolistTitle =
  createAsyncThunk('todoLists/changeTodolist',
    async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
      dispatch(setAppStatus('loading'))
      dispatch(changeTodoListEntityStatus({id: param.todolistId, entityStatus: 'loading'}))
      try {
        const res = await todoListsAPI.updateTodoList(param.todolistId, param.title)
        if (res.data.resultCode === ResultCode.SUCCESSFUL) {
          dispatch(setAppStatus('idle'))
          return {title: param.title, id: param.todolistId}
        } else {
          handleServerAppError(dispatch, res.data)
          return rejectWithValue(null)
        }
      } catch (e) {
        handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
        return rejectWithValue(null)
      } finally {
        dispatch(changeTodoListEntityStatus({id: param.todolistId, entityStatus: 'idle'}))
      }
    })

export const todoListsAsyncActions = {
  fetchTodoLists,
  addTodolist,
  removeTodolist,
  changeTodolistTitle
}

export const sliceTodoListsReducer = createSlice({
  name: 'todoLists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodoListFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodoListEntityStatus(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.entityStatus
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
      const todoLists = [...action.payload].reverse()
      return todoLists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
    })
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.push({...action.payload, filter: 'all', entityStatus: "idle"})
    })
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload)
      state.splice(index, 1)
    })
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload?.id)
      state[index].title = action.payload.title
    })
  }
})

export const todoListsReducer = sliceTodoListsReducer.reducer
export const {
  changeTodoListFilter,
  changeTodoListEntityStatus
} = sliceTodoListsReducer.actions