import {instance} from "api/todoListsAPI";

export const authAPI = {
    login(values: AuthValues) {
        return instance.post<AuthResponseType<MeType>>('auth/login', values)
    },
    verifyLogin() {
        return instance.get<AuthResponseType<UserType>>('auth/me')
    },
    logout() {
        return instance.delete<AuthResponseType>('auth/login')
    }
}

// Types
type AuthResponseType<D = {}> = {
    resultCode: number
    messages: string
    data: D
}
type MeType = {
    userId: number
}
type UserType = {
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