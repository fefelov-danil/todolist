import * as appSelectors from './selectors'
import {sliceAppReducer} from 'app/reducers/app-reducer'
import {useAppDispatch} from "utils/redux-utils";

const appActions = {
  ...sliceAppReducer.actions
}

export {
  appSelectors,
  appActions,
  useAppDispatch
}