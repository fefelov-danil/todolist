import React, {useEffect} from 'react';
import 'assets/geniral-css/reset.css'
import 'assets/geniral-css/style.css';
import s from './App.module.css';
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import {ErrorSnackbar} from "common/errorSnackbar";
import {authActions, authSelectors} from "features/auth";
import {appSelectors} from "./";
import {todoListsActions} from "features/todolists";
import mainBg from 'assets/images/todo-fon.jpg'
import {Header} from "common/header/Header";
import {useActions} from "utils/redux-utils";
import {useSelector} from "react-redux";
import {Pages} from "common/routes/Pages";

export function App() {

  const isAppLoading = useSelector(appSelectors.selectAppLoading)
  const isVerifyLogin = useSelector(authSelectors.selectVerifyLogin)
  const appStatus = useSelector(appSelectors.selectAppStatus)
  const {verifyLogin} = useActions(authActions)
  const {fetchTodoLists} = useActions(todoListsActions)

  useEffect(() => {
    if (isVerifyLogin === 'waiting') {
      verifyLogin()
    } else if (isVerifyLogin) {
      fetchTodoLists()
    }
  }, [isVerifyLogin])

  if (isAppLoading) return <div className={'circularProgress'}><CircularProgress/></div>

  return (
    <div className={s.App} style={{backgroundImage: `url('${mainBg}')`}}>
      <div>
        <div className={'linear-progress'}>
          {appStatus === 'loading' && <LinearProgress/>}
        </div>
        <Header/>
        <ErrorSnackbar/>
        <Pages />
      </div>
    </div>
  );
}
