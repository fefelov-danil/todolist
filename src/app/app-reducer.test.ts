import {
    appReducer,
    appReducerStateType,
    RequestStatusType,
    setAppErrorAC,
    setAppStatusAC,
} from "app/app-reducer";

let initialState : appReducerStateType

beforeEach(() => {
    initialState = {
        appStatus: 'idle' as RequestStatusType,
        appError: null as null | string,
        isAuthLoading: false as boolean
    }
})

test('change app status', () => {
    const action = setAppStatusAC('loading')

    const endState = appReducer(initialState, action)

    expect(endState.appStatus).toBe('loading')
    expect(endState.appError).toBe(null)
})
test('change app error', () => {
    const action = setAppErrorAC('Some Error')

    const endState = appReducer(initialState, action)

    expect(endState.appError).toBe('Some Error')
    expect(endState.appStatus).toBe('idle')
})