import {ActionCreatorsMapObject, AnyAction, bindActionCreators, combineReducers} from "redux";
import {todoListsReducer} from "components/todolists";
import {tasksReducer} from "components/todolists";
import thunk, {ThunkAction} from "redux-thunk";
import {appReducer} from "app/app-reducer";
import {authReducer} from "components/features/auth";
import {configureStore} from "@reduxjs/toolkit";

import {useAppDispatch} from "app";
import {useMemo} from "react";
import {FieldsErrorsType} from "api/authAPI";

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

    return useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])
}

export type ThunkError = { rejectValue: { errors: string[]; fieldsErrors?: Array<FieldsErrorsType> } }

// @ts-ignore
window.store = store