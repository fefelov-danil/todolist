import {AnyAction, combineReducers} from "redux";
import {tasksReducer, todoListsReducer} from "features/todolists";
import thunk, {ThunkAction} from "redux-thunk";
import {appReducer} from "app/reducers/app-reducer";
import {authReducer} from "features/auth";
import {configureStore} from "@reduxjs/toolkit";
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

export type ThunkError = { rejectValue: { errors: string[]; fieldsErrors?: Array<FieldsErrorsType> } }

// @ts-ignore
window.store = store