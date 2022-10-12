import {Dispatch} from "redux";
import {authAPI, AuthValues} from "api/authAPI";
import {setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {handleServerNetworkAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk('auth/login', async (values: AuthValues, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC('loading'))
    const res = await authAPI.login(values)
    if (res.data.resultCode === 0) {
        thunkAPI.dispatch(loginAC(true))
        thunkAPI.dispatch(verifyLoginAC(true))
    } else {
        thunkAPI.dispatch(setAppErrorAC({appError: res.data.messages[0]}))
    }
})

export const loginTC1 = (values: AuthValues) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(values)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(loginAC(true))
                dispatch(verifyLoginAC(true))
            } else {
                dispatch(setAppErrorAC({appError: res.data.messages[0]}))
            }
        })
        .catch(error => {
            handleServerNetworkAppError(dispatch, error)
        })
        .finally(() => {
            dispatch(setAppStatusAC('idle'))
        })
}

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        isVerifyLogin: false
    },
    reducers: {
        loginAC(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload
        },
        verifyLoginAC(state, action: PayloadAction<boolean>) {
            state.isVerifyLogin = action.payload
        }
    }
})

export const {loginAC, verifyLoginAC} = slice.actions
export const authReducer = slice.reducer

// Thunks
export const verifyLoginTC = () => (dispatch: Dispatch) => {
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
export const logoutTC = () => (dispatch: Dispatch) => {
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