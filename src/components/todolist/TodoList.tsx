import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "components/addItemForm/AddItemForm";
import {EditableSpan} from "components/editableSpan/EditableSpan";
import {addTaskTC, fetchTasksTC} from "reducers/tasks-reducer";
import {changeTodoListFilterAC, changeTodolistTC, removeTodolistTC} from "reducers/todolist-reducer";
import {Task} from "components/todolist/task/Task";
import {FilterValuesType, TaskStatuses} from "api/todoListsAPI";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import IconButton from '@mui/material/IconButton/IconButton';
import {DeleteOutline} from "@mui/icons-material";
import {Button, List} from "@mui/material";
import {RequestStatusType} from "app/app-reducer";

type TodoListPropsType = {
    todoListID: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const TodoList = React.memo( (props: TodoListPropsType) => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(state => state.tasks[props.todoListID])

    const removeTodoList = useCallback( () => {
        dispatch(removeTodolistTC(props.todoListID))
    }, [props.todoListID])

    const changeFilter = useCallback( (filter: FilterValuesType) => {
        dispatch(changeTodoListFilterAC(props.todoListID, filter))
    }, [props.todoListID])

    const changeTodoListTitle = useCallback( (title: string) => {
        dispatch(changeTodolistTC(props.todoListID, title))
    }, [props.todoListID])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(props.todoListID, title))
    }, [props.todoListID])

    let tasksForRender = tasks
    if (props.filter === "active") {
        tasksForRender = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === "completed") {
        tasksForRender = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const tasksJSXElements = tasksForRender.length
        ? tasksForRender.map(t => <Task
            key={t.id}
            todoListID={props.todoListID}
            task={t}/>
        )
        : <span>List is empty</span>

    useEffect(() => {
        dispatch(fetchTasksTC(props.todoListID))
    }, [])

    return (
        <div>
            <h3>
                <EditableSpan
                    title={props.title}
                    updateTitle={changeTodoListTitle}
                    disabled={props.entityStatus === 'loading'}/>
                <IconButton
                    color={"secondary"}
                    size={"small"}
                    disabled={props.entityStatus === 'loading'}
                    onClick={removeTodoList}>
                    <DeleteOutline/>
                </IconButton>
            </h3>
            <AddItemForm
                addItem={addTask}
                disabled={props.entityStatus === 'loading'}
                />
            <List>
                {tasksJSXElements}
            </List>
            <div>
                <Button
                    size={"small"}
                    color={props.filter === "all" ? "secondary" : "primary"}
                    variant={"contained"}
                    disableElevation
                    onClick={() => changeFilter("all")}>All</Button>
                <Button
                    size={"small"}
                    color={props.filter === "active" ? "secondary" : "primary"}
                    variant={"contained"}
                    disableElevation
                    onClick={() => changeFilter("active")}>Active</Button>
                <Button
                    size={"small"}
                    color={props.filter === "completed" ? "secondary" : "primary"}
                    variant={"contained"}
                    disableElevation
                    onClick={() => changeFilter("completed")}>Completed</Button>
            </div>
        </div>
    );
} );