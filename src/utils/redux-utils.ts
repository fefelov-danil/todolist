import {useDispatch} from "react-redux";
import {AppDispatch} from "app/store";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>()

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [])
}