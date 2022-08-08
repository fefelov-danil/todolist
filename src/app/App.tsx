import React, {useCallback, useEffect} from 'react';
import 'app/App.css';
import {TodoList} from "components/todolist/TodoList";
import {AddItemForm} from "components/addItemForm/AddItemForm";
import {addTodolistTC, fetchTodoListsThunk} from "reducers/todolist-reducer";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import ErrorSnackbar from "components/errorSnackbar/ErrorSnackbar";

export function App() {
    //BLL:
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(state => state.todoLists)
    const appStatus = useAppSelector(state => state.app.appStatus)

    const addTodoList = useCallback ((title: string) => {
        dispatch(addTodolistTC(title))
    }, [])

    //GUI:
    const todoListsComponents = todoLists.length
        ? todoLists.map(tl => {
            return (
                <Grid
                    item
                    key={tl.id}>
                    <Paper
                        elevation={8}
                        style={{padding: "20px"}}
                        square>
                        <TodoList
                            todoListID={tl.id}
                            filter={tl.filter}
                            title={tl.title}
                            entityStatus={tl.entityStatus}
                        />
                    </Paper>
                </Grid>
            )
        })
        : <span>Create your first TodoList!</span>

    useEffect(() => {
        dispatch(fetchTodoListsThunk())
    }, [])

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TodoLists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
                <div className={'linear-progress'}>
                    {appStatus === 'loading' && <LinearProgress />}
                </div>
            </AppBar>
            <Container fixed>
                <Grid container style={{margin: "15px 0"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid  container spacing={4}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}
