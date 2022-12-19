import {
  ResultCode, TaskDomainType,
  TaskPriorities,
  TaskStatuses,
  todoListsAPI, UpdateTaskModelType
} from "api/todoListsAPI";
import {RootState} from "app/store";
import {RequestStatusType, setAppStatus} from "app/reducers/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {changeTodoListEntityStatus, todoListsAsyncActions} from "features/todolists/reducers/todolists-reducer";

export const fetchTasks =
  createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    try {
      const res = await todoListsAPI.getTasks(todolistId)
      dispatch(setAppStatus('idle'))
      return {todolistId, tasks: res.data.items}
    } catch (e) {
      handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
      return rejectWithValue(null)
    }
  })
export const addTask =
  createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
  }) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodoListEntityStatus({id: param.todolistId, entityStatus: 'loading'}))
    try {
      const res = await todoListsAPI.createTask(param.todolistId, param.title)
      if (res.data.resultCode === ResultCode.SUCCESSFUL) {
        dispatch(setAppStatus('succeeded'))
        return {task: res.data.data.item}
      } else {
        handleServerAppError(dispatch, res.data)
        dispatch(setAppStatus('failed'))
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
      return rejectWithValue(null)
    } finally {
      dispatch(changeTodoListEntityStatus({id: param.todolistId, entityStatus: 'failed'}))
    }
  })
export const removeTask =
  createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, {
    dispatch,
    rejectWithValue
  }) => {

    const changeTaskEntityStatus = (status: RequestStatusType) => {
      dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: status
      }))
    }

    dispatch(setAppStatus('loading'))
    changeTaskEntityStatus('loading')
    try {
      await todoListsAPI.deleteTask(param.todolistId, param.taskId)
      dispatch(setAppStatus('idle'))
      return {todolistId: param.todolistId, taskId: param.taskId}
    } catch (e) {
      handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
      return rejectWithValue(null)
    } finally {
      changeTaskEntityStatus('idle')
    }
  })

export const updateTask =
  createAsyncThunk('tasks/updateTask',
    async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, {
      dispatch,
      getState,
      rejectWithValue
    }) => {
      const store = getState() as RootState
      const task = store.tasks[param.todolistId].find(t => t.id === param.taskId)
      if (!task) {
        return rejectWithValue(null)
      }

      const changeTaskEntityStatus = (status: RequestStatusType) => {
        dispatch(changeTaskEntityStatusAC({
          todolistId: param.todolistId,
          taskId: param.taskId,
          entityStatus: status
        }))
      }

      const apiModel: UpdateTaskModelType = {
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        status: task.status,
        ...param.domainModel
      }
      dispatch(setAppStatus('loading'))
      changeTaskEntityStatus('loading')
      try {
        const res = await todoListsAPI.updateTask(param.todolistId, param.taskId, apiModel)
        if (res.data.resultCode === ResultCode.SUCCESSFUL) {
          dispatch(setAppStatus('idle'))
          return res.data.data.item
        } else {
          handleServerAppError(dispatch, res.data)
          dispatch(setAppStatus('failed'))
          return rejectWithValue(null)
        }
      } catch (e) {
        handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
        return rejectWithValue(null)
      } finally {
        changeTaskEntityStatus('idle')
      }
    })

export const tasksAsyncActions = {
  fetchTasks,
  addTask,
  removeTask,
  updateTask
}

const initialState = {} as TasksStateType

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId]
        .map(t => t.id === action.payload.taskId ? {...t, entityStatus: action.payload.entityStatus} : t)
    },
    clearTasks: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(todoListsAsyncActions.fetchTodoLists.fulfilled, (state, action) => {
      if (action.payload) {
        action.payload.forEach(tl => {
          if (state[tl.id] === undefined) {
            state[tl.id] = []
          }
        })
      }
    })
    builder.addCase(todoListsAsyncActions.addTodolist.fulfilled, (state, action) => {
      state[action.payload.id] = []
    })
    builder.addCase(todoListsAsyncActions.removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload]
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
    })
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'})
    })
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload?.taskId)
      tasks.splice(index, 1)
    })
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoListId]
      const index = tasks.findIndex(t => t.id === action.payload?.id)
      tasks[index] = {...action.payload, entityStatus: 'idle'}
    })
  }
})

export const tasksReducer = slice.reducer
export const {changeTaskEntityStatusAC, clearTasks} = slice.actions

// Types
export type TasksStateType = {
  [todoListID: string]: Array<TaskDomainType>
}

type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}