import {Dispatch} from "redux";
import {AllActionsType} from "app/store";
import {authAPI, AuthValues} from "api/authAPI";
import {setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {handleServerNetworkAppError} from "utils/error-utils";

const initialState = {
    isLoggedIn: false,
    isVerifyLogin: false
}

export const authReducer = (state: StateType = initialState, action: LoginActionsType) => {
    switch (action.type) {
        case "login/LOGIN":
            return {...state, isLoggedIn: action.isLoggedIn}
        case "login/VERIFY-LOGIN":
            return {...state, isVerifyLogin: action.isVerifyLogin}
        default:
            return state
    }
}

// Actions
export const loginAC = (isLoggedIn: boolean) => ({type: 'login/LOGIN', isLoggedIn} as const)
export const verifyLoginAC = (isVerifyLogin: boolean) => ({type: 'login/VERIFY-LOGIN', isVerifyLogin} as const)

// Thunks
export const loginTC = (values: AuthValues) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(values)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(loginAC(true))
                dispatch(verifyLoginAC(true))
            } else {
                dispatch(setAppErrorAC(res.data.messages[0]))
            }
        })
        .catch(error => {
            handleServerNetworkAppError(dispatch, error)
        })
        .finally(() => {
            dispatch(setAppStatusAC('idle'))
        })
}
export const verifyLoginTC = () => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppAuthLoadingAC(true))
    authAPI.verifyLogin()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(verifyLoginAC(true))
            } else {
                dispatch(verifyLoginAC(false))
            }
        })
        .finally(() => {
            dispatch(setAppAuthLoadingAC(false))
        })
}
export const logoutTC = () => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(verifyLoginAC(false))
            }
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
        .finally(() => {
            dispatch(setAppStatusAC('idle'))
        })
}

// Types
type StateType = typeof initialState

export type LoginActionsType =
    | ReturnType<typeof loginAC>
    | ReturnType<typeof verifyLoginAC>