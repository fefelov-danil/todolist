import {AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {todoListsReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useSelector} from "react-redux";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer
})

export type RootReducerType  = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

// @ts-ignore
window.store = store