import React, {useEffect} from 'react';
import 'assets/geniral-css/reset.css'
import 'assets/geniral-css/style.css';
import s from './App.module.css';
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import {ErrorSnackbar} from "common/errorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {PageNotFound} from "common/404";
import {TodoLists} from "features/todolists";
import {Login} from "features/auth";
import {authActions, authSelectors} from "features/auth";
import {appSelectors} from "./";
import {todoListsActions} from "features/todolists";
import mainBg from 'assets/images/todo-fon.jpg'
import {Header} from "common/header/Header";
import {useActions} from "utils/redux-utils";
import {useSelector} from "react-redux";

export function App() {

    const isAppLoading = useSelector(appSelectors.selectAppLoading)
    const isVerifyLogin = useSelector(authSelectors.selectVerifyLogin)
    const appStatus = useSelector(appSelectors.selectAppStatus)
    const {verifyLogin} = useActions(authActions)
    const {fetchTodoLists} = useActions(todoListsActions)

    useEffect(() => {
        if(!isVerifyLogin) {
            verifyLogin()
        } else {
            fetchTodoLists()
        }
    }, [isVerifyLogin])

    return (
        <div className={s.App}
             style = {{backgroundImage: `url('${mainBg}')`}}>
            {isAppLoading
                ? <div className={'circularProgress'}><CircularProgress /></div>
                : <div>
                    {isVerifyLogin
                        ? <div>
                            <div className={'linear-progress'}>
                                {appStatus === 'loading' && <LinearProgress />}
                            </div>
                            <ErrorSnackbar/>
                            <Header/>
                            <Routes>
                                <Route path={'/'} element={<TodoLists/>}/>
                                <Route path={'/auth'} element={<Login/>}/>
                                <Route path={'/404'} element={<PageNotFound/>}/>
                                <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                            </Routes>
                        </div>
                        : <div>
                            <div className={'linear-progress'}>
                                {appStatus === 'loading' && <LinearProgress />}
                            </div>
                            <Header/>
                            <Login/>
                        </div>
                    }
                </div>
            }
        </div>
    );
}
