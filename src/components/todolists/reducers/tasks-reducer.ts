import {
    addTodolistAC, changeTodoListEntityStatusAC, removeTodoListAC, setTodoListsAC,
} from "components/todolists/reducers/todolist-reducer";
import {
    ResultCode,
    TaskDomainType,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todoListsAPI,
    UpdateTaskModelType
} from "api/todoListsAPI";
import {Dispatch} from "redux";
import {RootReducerType, RootState} from "app/store";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const fetchTasksTC =
    createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC('loading'))
        try {
            const res = await todoListsAPI.getTasks(todolistId)
            thunkAPI.dispatch(setAppStatusAC('idle'))
            return {todolistId, tasks: res.data.items}
        } catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            handleServerNetworkAppError(thunkAPI.dispatch, error)
        }
    })
export const addTaskTC =
    createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC('loading'))
        try {
            const res = await todoListsAPI.createTask(param.todolistId, param.title)
            if (res.data.resultCode === ResultCode.SUCCESSFUL) {
                thunkAPI.dispatch(setAppStatusAC('succeeded'))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(thunkAPI.dispatch, res.data)
                thunkAPI.dispatch(setAppStatusAC('failed'))
            }
        } catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            handleServerNetworkAppError(thunkAPI.dispatch, error)
            thunkAPI.dispatch(changeTodoListEntityStatusAC({id: param.todolistId, entityStatus: 'failed'}))
        }
    })
export const removeTaskTC =
    createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC('loading'))
        thunkAPI.dispatch(changeTaskEntityStatusAC({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: 'loading'
        }))
        try {
            const res = await todoListsAPI.deleteTask(param.todolistId, param.taskId)
            thunkAPI.dispatch(setAppStatusAC('idle'))
            thunkAPI.dispatch(changeTaskEntityStatusAC({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: 'idle'
            }))
            return {todolistId: param.todolistId, taskId: param.taskId}
        } catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            handleServerNetworkAppError(thunkAPI.dispatch, error)
        }
    })

export const updateTaskTC =
    createAsyncThunk('tasks/updateTask',
        async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
            const store = thunkAPI.getState() as RootState
            const task = store.tasks[param.todolistId].find(t => t.id === param.taskId)
            if (!task) {
                return
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
            thunkAPI.dispatch(setAppStatusAC('loading'))
            thunkAPI.dispatch(changeTaskEntityStatusAC({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: 'loading'
            }))
            try {
                const res = await todoListsAPI.updateTask(param.todolistId, param.taskId, apiModel)
                if (res.data.resultCode === ResultCode.SUCCESSFUL) {
                    thunkAPI.dispatch(setAppStatusAC('idle'))
                    thunkAPI.dispatch(changeTaskEntityStatusAC({
                        todolistId: param.todolistId,
                        taskId: param.taskId,
                        entityStatus: 'idle'
                    }))
                    return res.data.data.item
                } else {
                    handleServerAppError(thunkAPI.dispatch, res.data)
                    thunkAPI.dispatch(setAppStatusAC('failed'))
                    thunkAPI.dispatch(changeTaskEntityStatusAC({
                        todolistId: param.todolistId,
                        taskId: param.taskId,
                        entityStatus: 'failed'
                    }))
                }
            } catch (e) {
                const error = e as Error | AxiosError<{ error: string }>
                handleServerNetworkAppError(thunkAPI.dispatch, error)
                thunkAPI.dispatch(changeTaskEntityStatusAC({
                    todolistId: param.todolistId,
                    taskId: param.taskId,
                    entityStatus: 'failed'
                }))
            }

        })

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            state[action.payload.todolistId] = state[action.payload.todolistId]
                .map(t => t.id === action.payload.taskId ? {...t, entityStatus: action.payload.entityStatus} : t)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.forEach(tl => state[tl.id] = [])
        })
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.id] = []
        })
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload]
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'})
            }
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                tasks.splice(index, 1)
            }
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex(t => t.id === action.payload?.id)
                tasks[index] = {...action.payload, entityStatus: 'idle'}
            }
        })
    }
})

export const tasksReducer = slice.reducer
export const {changeTaskEntityStatusAC} = slice.actions

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