import {
    appReducer,
    appReducerStateType,
    RequestStatusType, setAppLoading,
    setAppError,
    setAppStatus,
} from "app/reducers/app-reducer";

let initialState : appReducerStateType

beforeEach(() => {
    initialState = {
        appStatus: 'idle' as RequestStatusType,
        appError: null as null | string,
        isAppLoading: true as boolean
    }
})

test('change app status', () => {
    const action = setAppStatus('loading')

    const endState = appReducer(initialState, action)

    expect(endState.appStatus).toBe('loading')
    expect(endState.appError).toBe(null)
})
test('change app error', () => {
    const action = setAppError( {appError: 'Some Error'} )

    const endState = appReducer(initialState, action)

    expect(endState.appError).toBe('Some Error')
    expect(endState.appStatus).toBe('idle')
})
test('change isAuthLoading', () => {
    const action = setAppLoading(true)

    const endState = appReducer(initialState, action)

    expect(endState.isAppLoading).toBe(true)
})