import {
    AddTodoListAT,
    changeTodoListEntityStatusAC,
    ChangeTodoListEntityStatusAT,
    RemoveTodoListAT,
    SetTodoListsAT
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
import {AllActionsType, RootReducerType} from "app/store";
import {AppActionsType, RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => stateCopy[tl.id] = [])
            return stateCopy;
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [ {...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId] ]};
        case "CHANGE-TASK-ENTITY-STATUS":
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.entityStatus} : t)}
        case 'CHANGE-TASK':
            return {...state, [action.task.todoListId]: state[action.task.todoListId]
                    .map(t => t.id === action.task.id ? {...action.task, entityStatus: 'idle'} : t)}
        case "ADD-TODOLIST":
            return { [action.todolist.id]: [], ...state }
        case "REMOVE-TODOLIST":
            const copyState = {...state};
            delete copyState[action.todolistId];
            return copyState;
        default:
            return state
    }
}

// Actions
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)
export const removeTaskAC = (todolistId: string, taskId: string) => ({type: "REMOVE-TASK", todolistId, taskId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {type: 'CHANGE-TASK-ENTITY-STATUS',todolistId, taskId, entityStatus} as const
}
export const changeTaskAC = (task: TaskType) => ({type: 'CHANGE-TASK', task} as const)

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch( setAppStatusAC('idle'))
        } )
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<AllActionsType>) => {
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
            dispatch(changeTodoListEntityStatusAC(todolistId, 'failed'))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    todoListsAPI.deleteTask(todolistId, taskId)
        .then( () => {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch( setAppStatusAC('idle'))
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'idle'))
        } )
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>  {
    return (dispatch: Dispatch<AllActionsType>, getState: () => RootReducerType) => {
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
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
        todoListsAPI.updateTask(todolistId, taskId, apiModel)
            .then((response) => {
                if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                    dispatch(changeTaskAC(response.data.data.item))
                    dispatch( setAppStatusAC('idle'))
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'idle'))
                } else {
                    handleServerAppError(dispatch, response.data)
                    dispatch(setAppStatusAC('failed'))
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
                }

            } )
            .catch((error) => {
                handleServerNetworkAppError(dispatch, error)
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
            })
    }
}

// Types
export type TasksStateType = {
    [todoListID: string]: Array<TaskDomainType>
}

export type TasksActionsType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskEntityStatusAC>
    | ReturnType<typeof changeTaskAC>
    | SetTodoListsAT
    | AddTodoListAT
    | RemoveTodoListAT
    | AppActionsType
    | ChangeTodoListEntityStatusAT

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}