import {ActionCreatorsMapObject, AnyAction, bindActionCreators, combineReducers} from "redux";
import {todoListsReducer} from "components/todolists/todolists-reducer";
import thunk, {ThunkAction} from "redux-thunk";
import {appReducer} from "app/app-reducer";
import {authReducer} from "components/features/auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {tasksReducer} from "components/todolists/tasks-reducer";
import {useAppDispatch} from "app";
import {useMemo} from "react";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    login: authReducer
})

export type RootReducerType = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundActions
}

// @ts-ignore
window.store = store