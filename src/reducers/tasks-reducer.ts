import {
    AddTodoListAT,
    changeTodoListEntityStatusAC,
    ChangeTodoListEntityStatusAT,
    RemoveTodoListAT,
    SetTodoListsAT
} from "./todolist-reducer";
import {ResultCode, TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "api/todoListsAPI";
import {Dispatch} from "redux";
import {RootReducerType} from "reducers/store";
import {AppActionsType, setAppErrorAC, setAppStatusAC} from "app/app-reducer";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => stateCopy[tl.id] = [])
            return stateCopy;
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [ action.task, ...state[action.task.todoListId] ]};
        case 'CHANGE-TASK':
            return {...state, [action.task.todoListId]: state[action.task.todoListId]
                    .map(t => t.id === action.task.id ? {...action.task} : t)}
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
export const changeTaskAC = (task: TaskType) => ({type: 'CHANGE-TASK', task} as const)

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch( setAppStatusAC('idle'))
        } )
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListEntityStatusAC(todolistId, 'loading'))
    todoListsAPI.createTask(todolistId, title)
        .then(response => {
            if (response.data.resultCode === ResultCode.SUCCESSFUL) {
                dispatch(addTaskAC(response.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeTodoListEntityStatusAC(todolistId, 'idle'))
            } else {
                if (response.data.messages.length) {
                    dispatch(setAppErrorAC(response.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
                dispatch(changeTodoListEntityStatusAC(todolistId, 'idle'))
            }

        })
        .catch((error) => {
            dispatch(setAppErrorAC(error.message))
            dispatch(setAppStatusAC('failed'))
            dispatch(changeTodoListEntityStatusAC(todolistId, 'idle'))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.deleteTask(todolistId, taskId)
        .then( () => {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch( setAppStatusAC('idle'))
        } )
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>  {
    return (dispatch: Dispatch<ActionsType>, getState: () => RootReducerType) => {
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
        todoListsAPI.updateTask(todolistId, taskId, apiModel)
            .then((response) => {
                if (response.data.resultCode === 0) {
                    dispatch(changeTaskAC(response.data.data.item))
                    dispatch( setAppStatusAC('idle'))
                } else {
                    if (response.data.messages.length) {
                        dispatch(setAppErrorAC(response.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }

            } )
            .catch((error) => {
                dispatch(setAppErrorAC(error.message))
                dispatch(setAppStatusAC('failed'))
            })
    }
}

// Types
export type TasksStateType = {
    [todoListID: string]: Array<TaskType>
}

type ActionsType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
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