import {combineReducers} from "redux";
import {TodoListsActionsType, todoListsReducer} from "components/todolists/reducers/todolist-reducer";
import {TasksActionsType, tasksReducer} from "components/todolists/reducers/tasks-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer} from "app/app-reducer";
import {authReducer, LoginActionsType} from "components/features/login/authReducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    login: authReducer
})

export type RootReducerType  = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AllActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AllActionsType>

export type AllActionsType = AppActionsType | TodoListsActionsType | TasksActionsType | LoginActionsType

// @ts-ignore
window.store = store