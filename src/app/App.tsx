import React, {useEffect} from 'react';
import 'app/App.css';
import {fetchTodoListsTC} from "components/todolists/todolists-reducer";
import {useAppDispatch, useAppSelector} from "app/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {Menu} from "@mui/icons-material";
import Button from '@mui/material/Button';
import {ErrorSnackbar} from "components/errorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {PageNotFound} from "components/404/PageNotFound";
import {TodoLists} from "components/todolists/TodoLists";
import {Login} from "components/features/auth/Login";
import {logoutTC, verifyLoginTC} from "components/features/auth/auth-reducer";

export function App() {

    const dispatch = useAppDispatch()
    const appStatus = useAppSelector(state => state.app.appStatus)
    const isVerifyLogin = useAppSelector(state => state.login.isVerifyLogin)
    const isAppLoading = useAppSelector(state => state.app.isAppLoading)

    useEffect(() => {
        if(!isVerifyLogin) {
            dispatch(verifyLoginTC())
        } else {
            dispatch(fetchTodoListsTC())
        }
    }, [isVerifyLogin])

    const logoutHandler = () => {
        dispatch(logoutTC())
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
