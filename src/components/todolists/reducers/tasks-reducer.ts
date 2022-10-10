import {
    addTodolistAC,
    changeTodoListEntityStatusAC, removeTodoListAC, setTodoListsAC,
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
import {RootReducerType} from "app/store";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        },
        removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<TaskType>) {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
        },
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            state[action.payload.todolistId] = state[action.payload.todolistId]
                .map(t => t.id === action.payload.taskId ? {...t, entityStatus: action.payload.entityStatus} : t)
        },
        changeTaskAC(state, action: PayloadAction<TaskType>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index] = {...action.payload, entityStatus: 'idle'}
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
    }
})

export const tasksReducer = slice.reducer
export const {setTasksAC, removeTaskAC, addTaskAC, changeTaskEntityStatusAC, changeTaskAC} = slice.actions

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC( {todolistId, tasks: res.data.items} ))
            dispatch(setAppStatusAC('idle'))
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.createTask(todolistId, title)
        .then(response => {
            if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                dispatch(addTaskAC(response.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, response.data)
                dispatch(setAppStatusAC('failed'))
            }

        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
            dispatch(changeTodoListEntityStatusAC({id: todolistId, entityStatus: 'failed'}))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: 'loading' }))
    todoListsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC({ todolistId, taskId }))
            dispatch(setAppStatusAC('idle'))
            dispatch(changeTaskEntityStatusAC( {todolistId, taskId, entityStatus: 'idle'} ))
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch, getState: () => RootReducerType) => {
        const task = getState().tasks[todolistId].find(t => t.id === taskId)
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
            ...domainModel
        }
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC( {todolistId, taskId, entityStatus: 'loading'} ))
        todoListsAPI.updateTask(todolistId, taskId, apiModel)
            .then((response) => {
                if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                    dispatch(changeTaskAC( response.data.data.item))
                    dispatch(setAppStatusAC('idle'))
                    dispatch(changeTaskEntityStatusAC( {todolistId, taskId, entityStatus: 'idle'} ))
                } else {
                    handleServerAppError(dispatch, response.data)
                    dispatch(setAppStatusAC('failed'))
                    dispatch(changeTaskEntityStatusAC( {todolistId, taskId, entityStatus: 'failed'} ))
                }

            })
            .catch((error) => {
                handleServerNetworkAppError(dispatch, error)
                dispatch(changeTaskEntityStatusAC( {todolistId, taskId, entityStatus: 'failed'} ))
            })
    }
}

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