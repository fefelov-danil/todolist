import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {setAppLoading, setAppError, setAppStatus} from "app/reducers/app-reducer";
import {authAPI, AuthValues} from "api/authAPI";
import {handleServerNetworkAppError} from "features/utils/error-utils";
import {AxiosError} from "axios";
import {ThunkError} from "app/store";

export const verifyLogin = createAsyncThunk('auth/verifyLogin', async (payload, {dispatch}) => {
    dispatch(setAppLoading(true))
    const res = await authAPI.me()
    dispatch(setAppLoading(false))
    return res.data.resultCode === 0
})
const loginTC = createAsyncThunk<void, AuthValues, ThunkError>
('auth/auth', async (values: AuthValues, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await authAPI.login(values)
        if (res.data.resultCode === 0) {
            dispatch(verifyLogin.fulfilled(true, ''))
            dispatch(setAppStatus('succeeded'))
        } else {
            dispatch(setAppError({appError: res.data.messages[0]}))
            dispatch(setAppStatus('failed'))
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        handleServerNetworkAppError(dispatch, error )
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})
const logoutTC = createAsyncThunk('auth/logout', async (payload, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await authAPI.logout()
        if(res.data.resultCode === 0) {
            dispatch(setAppStatus('succeeded'))
            return
        } else {
            dispatch(setAppStatus('failed'))
            handleServerNetworkAppError(dispatch, {name: 'Error', message: 'Error'})
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkAppError(dispatch, e as Error | AxiosError<{ error: string }>)
        return rejectWithValue(null)
    }
})

export const authAsyncActions = {
    verifyLogin,
    loginTC,
    logoutTC
}

const slice = createSlice({
    name: 'auth',
    initialState: {
        isVerifyLogin: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isVerifyLogin = false
        })
        builder.addCase(verifyLogin.fulfilled, (state, action) => {
            state.isVerifyLogin = action.payload
        })
    }
})

export const authReducer = slice.reducer