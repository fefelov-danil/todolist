import {authAPI, AuthValues, FieldsErrorsType} from "api/authAPI";
import {setAppLoading, setAppError, setAppStatus} from "app/app-reducer";
import {handleServerNetworkAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const verifyLoginTC = createAsyncThunk('auth/verifyLogin', async (payload, {dispatch}) => {
    dispatch(setAppLoading(true))
    const res = await authAPI.me()
    dispatch(setAppLoading(false))
    return res.data.resultCode === 0
})
export const loginTC = createAsyncThunk<
    void, AuthValues,
    { rejectValue: { errors: string[]; fieldsErrors?: Array<FieldsErrorsType> } }
    >('auth/auth', async (values: AuthValues, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await authAPI.login(values)
        if (res.data.resultCode === 0) {
            dispatch(verifyLoginTC.fulfilled(true, ''))
            dispatch(setAppStatus('succeeded'))
        } else {
            dispatch(setAppError({appError: res.data.messages[0]}))
            dispatch(setAppStatus('failed'))
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        dispatch(setAppStatus('failed'))
        handleServerNetworkAppError(dispatch, error)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (payload, {dispatch, rejectWithValue}) => {
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
        const error = e as Error | AxiosError<{ error: string }>
        dispatch(setAppStatus('failed'))
        handleServerNetworkAppError(dispatch, error)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isVerifyLogin: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isVerifyLogin = false
        })
        builder.addCase(verifyLoginTC.fulfilled, (state, action) => {
            state.isVerifyLogin = action.payload
        })
    }
})

export const authReducer = slice.reducer