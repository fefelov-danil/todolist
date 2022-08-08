export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    appStatus: 'idle' as RequestStatusType,
    appError: null as null | string
}

export const appReducer = (state: appReducerStateType = initialState, action: AppActionsType): appReducerStateType => {
    switch (action.type) {
        case "SET-STATUS":
            return {...state, appStatus: action.appStatus}
        case "SET-ERROR":
            return {...state, appError: action.appError}
        default:
            return state
    }
}

// Actions
export const setAppStatusAC = (appStatus: RequestStatusType) => ({type: 'SET-STATUS', appStatus} as const)
export const setAppErrorAC = (appError: null | string) => ({type: 'SET-ERROR', appError} as const)

// types
export type appReducerStateType = typeof initialState
export type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>