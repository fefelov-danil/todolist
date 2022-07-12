import {combineReducers, compose, createStore, legacy_createStore} from "redux";
import {todolistsReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}


const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, composeEnhancers());

// export const store = createStore(rootReducer)

export type AppRootStateType  = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store