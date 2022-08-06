export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string
}

export const appReducer = (state: appReducerStateType = initialState, action: AppActionsType): appReducerStateType => {
    switch (action.type) {
        case "SET-STATUS":
            return {...state, status: action.status}
        case "SET-ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}

// Actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) => ({type: 'SET-ERROR', error} as const)

// types
type appReducerStateType = typeof initialState
export type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>