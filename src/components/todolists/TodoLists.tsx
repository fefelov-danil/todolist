import React, {useCallback} from 'react';
import {Container, Grid, Paper} from "@mui/material";
import {AddItemForm} from "components/addItemForm/AddItemForm";
import {TodoList} from "components/todolists/todolist/TodoList";
import {useAppSelector} from "app/hooks";
import {todoListsActions, todosSelectors} from "components/todolists/index";
import {useActions} from "app/store";

export const TodoLists = () => {
    const todoLists = useAppSelector(todosSelectors.selectTodoLists)
    const {addTodolist} = useActions(todoListsActions)

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
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid  container spacing={4}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
};