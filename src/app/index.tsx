import * as appSelectors from './selectors'
import {sliceAppReducer} from './app-reducer'
import {useAppSelector} from './hooks'
import {useAppDispatch} from "utils/redux-utils";

const appActions = {
    ...sliceAppReducer.actions
}

export {
    appSelectors,
    appActions,
    useAppDispatch,
    useAppSelector
}