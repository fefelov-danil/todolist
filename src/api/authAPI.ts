import {instance} from "api/todoListsAPI";

export const authAPI = {
    login(values: AuthValues) {
        return instance.post<AuthResponseType<MeType>>('auth/login', values)
    },
    me() {
        return instance.get<AuthResponseType<UserType>>('auth/me')
    },
    logout() {
        return instance.delete<AuthResponseType>('auth/login')
    }
}

// Types
export type AuthResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors?: Array<FieldsErrorsType>
    data: D
}
export type FieldsErrorsType = {
    field: string
    error: string
}
export type MeType = {
    userId: number
}
export type UserType = {
    id: number
    email: string
    login: string
}
export type AuthValues = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}