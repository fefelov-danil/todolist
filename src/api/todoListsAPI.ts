import axios, {AxiosResponse} from "axios";
import {RequestStatusType} from "app/app-reducer";
import {string} from "prop-types";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '4e9b0636-58a9-499c-aa39-97e8d2fc85f8'
    }
})

export const todoListsAPI = {
    getTodoLists() {
        return instance.get<TodoListType[]>('/todo-lists')
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<{item : TodoListType}>>('/todo-lists', {title})
    },
    updateTodoList(todoListId: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${todoListId}`, {title})
    },
    deleteTodoList(todoListId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todoListId}`)
    },
    getTasks(todoListId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todoListId}/tasks`, {title})
    },
    updateTask(todoListId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{item: TaskType}>>(`/todo-lists/${todoListId}/tasks/${taskId}`, model)
    },
    deleteTask(todoListId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todoListId}/tasks/${taskId}`)
    }
}

// Types
export type TodoListType = {
    id: string
    addedDate: string
    title: string
    order: number
}
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type ResponseType<T = {}> = {
    data: T
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export enum ResultCode {
    SUCCESSFUL = 0,
    BAD_RESPONSE = 1,
    CAPTCHA = 10
}
export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}
export type TaskDomainType = TaskType & {entityStatus: RequestStatusType}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: string | null
}