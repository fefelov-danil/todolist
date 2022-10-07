import {ResponseType} from "api/todoListsAPI";
import {AppActionsType, setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {Dispatch} from "redux";
import {AxiosError} from "axios";

export const handleServerAppError = <T>(dispatch: Dispatch<AppActionsType>, response: ResponseType<T>) => {
    if (response.messages.length) {
        dispatch(setAppErrorAC(response.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkAppError = (dispatch: Dispatch<AppActionsType>, error: AxiosError) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}