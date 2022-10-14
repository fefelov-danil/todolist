import {ResponseType} from "api/todoListsAPI";
import {setAppError, setAppStatus} from "app/app-reducer";
import {Dispatch} from "redux";
import {AxiosError} from "axios";

export const handleServerAppError = <T>(dispatch: Dispatch, response: ResponseType<T>) => {
    if (response.messages.length) {
        dispatch(setAppError( { appError: response.messages[0]} ))
    } else {
        dispatch(setAppError( {appError: 'Some error occurred'} ))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkAppError = (dispatch: Dispatch, error: Error | AxiosError<{ error: string }>) => {
    dispatch(setAppError( { appError: error.message} ))
    dispatch(setAppStatus('failed'))
}