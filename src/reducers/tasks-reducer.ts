import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT, SetTodoListsAT} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI} from "api/todoListsAPI";
import {Dispatch} from "redux";
import {RootReducerType} from "reducers/store";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
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
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todoListsAPI.getTasks(todolistId)
        .then(res => dispatch(setTasksAC(res.data.items, todolistId)) )
}
export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todoListsAPI.createTask(todolistId, title)
        .then(response => dispatch(addTaskAC(response.data.data.item)) )
}
export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    todoListsAPI.deleteTask(todolistId, taskId)
        .then( () => dispatch(removeTaskAC(todolistId, taskId)) )
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>  {
    return (dispatch: Dispatch, getState: () => RootReducerType) => {
        const task = getState().tasks[todolistId].find(t => t.id === taskId)

        if (task) {
            todoListsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                status: task.status,
                ...domainModel
            }).then((res) => {
                dispatch(changeTaskAC(res.data.data.item))
            })
        }
    }
}

// Types
export type TasksStateType = {
    [todoListID: string]: Array<TaskType>
}

export type ActionType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskAC>
    | SetTodoListsAT
    | AddTodoListAT
    | RemoveTodoListAT

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}