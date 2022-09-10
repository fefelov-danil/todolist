import React, {useCallback, useEffect} from 'react';
import {Container, Grid, Paper} from "@mui/material";
import {AddItemForm} from "components/addItemForm/AddItemForm";
import {addTodolistTC, fetchTodoListsTC} from "components/todolists/reducers/todolist-reducer";
import {TodoList} from "components/todolists/todolist/TodoList";
import {useAppDispatch, useAppSelector} from "hooks/hooks";

export const TodoLists = () => {
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(state => state.todoLists)
    const isVerifyLogin = useAppSelector(state => state.login.isVerifyLogin)

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

    return (
        <div>
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
};