import React, {useEffect} from 'react';
import 'assets/geniral-css/reset.css'
import 'assets/geniral-css/style.css';
import s from './App.module.css';
import {useAppSelector} from "./";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import {ErrorSnackbar} from "components/errorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {PageNotFound} from "components/404";
import {TodoLists} from "components/todolists";
import {Login} from "components/features/auth";
import {authActions, authSelectors} from "components/features/auth";
import {appSelectors} from "./";
import {useActions} from "app/store";
import {todoListsActions} from "components/todolists";
import mainBg from 'assets/images/todo-fon.jpg'
import {Header} from "header/Header";

export function App() {

    const isAppLoading = useAppSelector(appSelectors.selectAppLoading)
    const isVerifyLogin = useAppSelector(authSelectors.selectVerifyLogin)
    const appStatus = useAppSelector(appSelectors.selectAppStatus)
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
