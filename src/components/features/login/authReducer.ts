import {Dispatch} from "redux";
import {authAPI, AuthValues} from "api/authAPI";
import {setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {handleServerNetworkAppError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    isVerifyLogin: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
        verifyLoginAC(state, action: PayloadAction<{ isVerifyLogin: boolean }>) {
            state.isVerifyLogin = action.payload.isVerifyLogin
        }
    }
})

export const {loginAC, verifyLoginAC} = slice.actions
export const authReducer = slice.reducer

// Thunks
export const loginTC = (values: AuthValues) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({appStatus: 'loading'}))
    authAPI.login(values)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(loginAC({isLoggedIn: true}))
                dispatch(verifyLoginAC({isVerifyLogin: true}))
            } else {
                dispatch(setAppErrorAC({appError: res.data.messages[0]}))
            }
        })
        .catch(error => {
            handleServerNetworkAppError(dispatch, error)
        })
        .finally(() => {
            dispatch(setAppStatusAC({appStatus: 'idle'}))
        })
}
export const verifyLoginTC = () => (dispatch: Dispatch) => {
    dispatch(setAppAuthLoadingAC({isAuthLoading: true}))
    authAPI.verifyLogin()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(verifyLoginAC({isVerifyLogin: true}))
            } else {
                dispatch(verifyLoginAC({isVerifyLogin: false}))
            }
        })
        .finally(() => {
            dispatch(setAppAuthLoadingAC({isAuthLoading: false}))
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({appStatus: 'loading'}))
    authAPI.logout()
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(verifyLoginAC({isVerifyLogin: false}))
            }
        })
        .catch((error) => {
            handleServerNetworkAppError(dispatch, error)
        })
        .finally(() => {
            dispatch(setAppStatusAC({appStatus: 'idle'}))
        })
}