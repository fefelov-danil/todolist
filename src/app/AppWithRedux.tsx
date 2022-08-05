import React, {useCallback, useEffect} from 'react';
import 'app/App.css';
import {TodoList} from "TodoList";
import {AddItemForm} from "addItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Menu} from "@material-ui/icons";
import {addTodolistTC, fetchTodoListsThunk} from "reducers/todolist-reducer";
import {useAppDispatch, useAppSelector} from "hooks/hooks";

export function AppWithRedux() {
    //BLL:
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(state => state.todoLists)

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
            </AppBar>
            <div className={'linear-progress'}>
                <LinearProgress />
            </div>
            <Container fixed>
                <Grid container style={{margin: "15px 0"}}>
                    <AddItemForm addItem={addTodoList} />
                </Grid>
                <Grid  container spacing={4}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}
