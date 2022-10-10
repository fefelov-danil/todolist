import {ResponseType} from "api/todoListsAPI";
import {setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {Dispatch} from "redux";
import {AxiosError} from "axios";

export const handleServerAppError = <T>(dispatch: Dispatch, response: ResponseType<T>) => {
    if (response.messages.length) {
        dispatch(setAppErrorAC( { appError: response.messages[0]} ))
    } else {
        dispatch(setAppErrorAC( {appError: 'Some error occurred'} ))
    }
    dispatch(setAppStatusAC( {appStatus: 'failed'} ))
}

export const handleServerNetworkAppError = (dispatch: Dispatch, error: AxiosError) => {
    dispatch(setAppErrorAC( { appError: error.message} ))
    dispatch(setAppStatusAC({ appStatus: 'failed'} ))
}