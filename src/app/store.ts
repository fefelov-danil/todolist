import {AnyAction, combineReducers} from "redux";
import {todoListsReducer} from "components/todolists/reducers/todolist-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer} from "app/app-reducer";
import {authReducer} from "components/features/login/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {tasksReducer} from "components/todolists/reducers/tasks-reducer";

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
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

// export type AllActionsType = AppActionsType | TodoListsActionsType | TasksActionsType | LoginActionsType

// @ts-ignore
window.store = store