import React, {useEffect} from 'react';
import 'app/App.css';
import {useAppSelector} from "./";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {Menu} from "@mui/icons-material";
import Button from '@mui/material/Button';
import {ErrorSnackbar} from "components/errorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {PageNotFound} from "components/404";
import {TodoLists} from "components/todolists";
import {Login} from "components/features/auth";
import {authActions, authSelectors} from "components/features/auth";
import {appSelectors} from "app";
import {useActions} from "app/store";
import {todoListsActions} from "components/todolists";

export function App() {

    const appStatus = useAppSelector(appSelectors.selectAppStatus)
    const isAppLoading = useAppSelector(appSelectors.selectAppLoading)
    const isVerifyLogin = useAppSelector(authSelectors.selectVerifyLogin)
    const {verifyLoginTC, logoutTC} = useActions(authActions)
    const {fetchTodoLists} = useActions(todoListsActions)

    useEffect(() => {
        if(!isVerifyLogin) {
            verifyLoginTC()
        } else {
            fetchTodoLists()
        }
    }, [isVerifyLogin])

    const logoutHandler = () => {
        logoutTC()
    }

    return (
        <div className="App">
            {isAppLoading
                ? <div className={'circularProgress'}><CircularProgress /></div>
                : <div>
                    {isVerifyLogin
                        ? <div>
                            <ErrorSnackbar/>
                            <AppBar position="static">
                                <Toolbar style={{justifyContent: "space-between"}}>
                                    <IconButton edge="start" color="inherit" aria-label="menu">
                                        <Menu/>
                                    </IconButton>
                                    <Typography variant="h6">
                                        TodoLists
                                    </Typography>
                                    {isVerifyLogin && <Button
                                        color="inherit"
                                        variant={"outlined"}
                                        onClick={logoutHandler}>Logout</Button>}
                                </Toolbar>
                                <div className={'linear-progress'}>
                                    {appStatus === 'loading' && <LinearProgress />}
                                </div>
                            </AppBar>
                            <Routes>
                                <Route path={'/'} element={<TodoLists/>}/>
                                <Route path={'/auth'} element={<Login/>}/>
                                <Route path={'/404'} element={<PageNotFound/>}/>
                                <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                            </Routes>
                        </div>
                        : <Login/>
                    }
                </div>
            }
        </div>
    );
}
