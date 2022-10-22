import {RootState} from "app/store";

export const selectAppStatus = (state: RootState) => state.app.appStatus
export const selectAppLoading = (state: RootState) => state.app.isAppLoading
export const selectAppError = (state: RootState) => state.app.appError