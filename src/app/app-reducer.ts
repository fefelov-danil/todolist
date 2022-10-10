import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    appStatus: 'idle' as RequestStatusType,
    appError: null as null | string,
    isAuthLoading: true as boolean
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ appStatus: RequestStatusType }>) {
            state.appStatus = action.payload.appStatus
        },
        setAppErrorAC(state, action: PayloadAction<{ appError: null | string }>) {
            state.appError = action.payload.appError
        },
        setAppAuthLoadingAC(state, action: PayloadAction<{ isAuthLoading: boolean }>) {
            state.isAuthLoading = action.payload.isAuthLoading
        }
    }
})

export const {setAppStatusAC, setAppErrorAC, setAppAuthLoadingAC} = slice.actions
export const appReducer = slice.reducer

// types
export type appReducerStateType = typeof initialState