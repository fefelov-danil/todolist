import * as appSelectors from './selectors'
import {sliceAppReducer} from './app-reducer'
import {useAppDispatch} from './hooks'
import {useAppSelector} from './hooks'

const appActions = {
    ...sliceAppReducer.actions
}

export {
    appSelectors,
    appActions,
    useAppDispatch,
    useAppSelector
}