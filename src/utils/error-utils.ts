import {ResponseType} from "api/todoListsAPI";
import {setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {changeTodoListEntityStatusAC} from "reducers/todolist-reducer";
import {useAppDispatch} from "hooks/hooks";

const dispatch = useAppDispatch()

export const handleServerAppError = (response: ResponseType) => {
    if (response.messages.length) {
        dispatch(setAppErrorAC(response.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}