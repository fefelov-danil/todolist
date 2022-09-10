import {Dispatch} from "redux";
import {AllActionsType} from "app/store";
import {authAPI, AuthValues} from "api/authAPI";
import {setAppAuthLoadingAC} from "app/app-reducer";
import {handleServerNetworkAppError} from "utils/error-utils";

const initialState: stateType = {
    isLoggedIn: false,
    isVerifyLogin: false
}

export const authReducer = (state: stateType = initialState, action: loginActionsType) => {
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
    authAPI.login(values)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(loginAC(true))
                dispatch(verifyLoginAC(true))
            }
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
    authAPI.logout()
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(verifyLoginAC(false))
            }
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })

}

// Types
export type loginActionsType =
    | ReturnType<typeof loginAC>
    | ReturnType<typeof verifyLoginAC>

type stateType = {
    isLoggedIn: boolean
    isVerifyLogin: boolean
}