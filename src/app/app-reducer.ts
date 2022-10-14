import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'app',
    initialState: {
        appStatus: 'idle' as RequestStatusType,
        appError: null as null | string,
        isAuthLoading: true as boolean
    },
    reducers: {
        setAppStatus(state, action: PayloadAction<RequestStatusType>) {
            state.appStatus = action.payload
        },
        setAppError(state, action: PayloadAction<{ appError: null | string }>) {
            state.appError = action.payload.appError
        },
        setAppLoading(state, action: PayloadAction<boolean>) {
            state.isAuthLoading = action.payload
        }
    }
})

export const {setAppStatus, setAppError, setAppLoading} = slice.actions
export const appReducer = slice.reducer

// types
export type appReducerStateType = ReturnType<typeof slice.getInitialState>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'