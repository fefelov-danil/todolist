import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const sliceAppReducer = createSlice({
  name: 'app',
  initialState: {
    appStatus: 'idle' as RequestStatusType,
    appError: null as null | string,
    isAppLoading: true as boolean
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<RequestStatusType>) {
      state.appStatus = action.payload
    },
    setAppError(state, action: PayloadAction<{ appError: null | string }>) {
      state.appError = action.payload.appError
    },
    setAppLoading(state, action: PayloadAction<boolean>) {
      state.isAppLoading = action.payload
    }
  }
})

export const {setAppStatus, setAppError, setAppLoading} = sliceAppReducer.actions
export const appReducer = sliceAppReducer.reducer

// types
export type appReducerStateType = ReturnType<typeof sliceAppReducer.getInitialState>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'