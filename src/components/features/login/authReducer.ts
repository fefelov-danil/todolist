import {authAPI, AuthValues, FieldsErrorsType} from "api/authAPI";
import {setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {handleServerNetworkAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const verifyLoginTC = createAsyncThunk('auth/verifyLogin', async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppAuthLoadingAC(true))
    const res = await authAPI.verifyLogin()
    thunkAPI.dispatch(setAppAuthLoadingAC(false))
    if (res.data.resultCode === 0) {
        return true
    } else {
        return false
    }
})
export const loginTC = createAsyncThunk<
    {isLoggedIn: boolean}, AuthValues,
    { rejectValue: { errors: string[]; fieldsErrors?: Array<FieldsErrorsType> } }
    >('auth/login', async (values: AuthValues, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(values)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(verifyLoginTC.fulfilled(true, ''))
            thunkAPI.dispatch(setAppStatusAC('succeeded'))
            return {isLoggedIn: true}
        } else {
            thunkAPI.dispatch(setAppErrorAC({appError: res.data.messages[0]}))
            thunkAPI.dispatch(setAppStatusAC('failed'))
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        thunkAPI.dispatch(setAppStatusAC('failed'))
        handleServerNetworkAppError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logout()
        if(res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC('succeeded'))
            return
        }
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        handleServerNetworkAppError(thunkAPI.dispatch, error)
    }
    thunkAPI.dispatch(setAppStatusAC('idle'))
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        isVerifyLogin: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isVerifyLogin = false
        })
        builder.addCase(verifyLoginTC.fulfilled, (state, action) => {
            state.isVerifyLogin = action.payload
        })
    }
})

export const authReducer = slice.reducer