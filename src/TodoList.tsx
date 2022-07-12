import React, {ChangeEvent, useCallback} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import {DeleteOutline, HighlightOff} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from "./reducers/tasks-reducer";
import {FilterValuesType, TaskType} from "./AppWithRedux";
import {changeTodoListFilterAC, changeTodoListTitleAC, removeTodoListAC} from "./reducers/todolist-reducer";
import {AppRootStateType} from "./reducers/store";

type TodoListPropsType = {
    todoListID: string
    title: string
    filter: FilterValuesType
}

export const TodoList = (props: TodoListPropsType) => {
    console.log("TodoList")
    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todoListID])

    let tasksForRender = tasks
    if (props.filter === "active") {
        tasksForRender = tasks.filter(t => !t.isDone)
    }
    if (props.filter === "completed") {
        tasksForRender = tasks.filter(t => t.isDone)
    }

    const tasksJSXElements = tasksForRender.length
        ? tasksForRender.map(t => {
            const removeTask = () => {
                dispatch({type: "REMOVE-TASK", todolistId: props.todoListID, taskId: t.id})
            }
            const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                dispatch(changeTaskStatusAC(props.todoListID, t.id, e.currentTarget.checked))
            }
            const changeTaskTitle = (title: string) => {
                dispatch(changeTaskTitleAC(props.todoListID, t.id, title))
            }

            const taskClasses = t.isDone ? "is-done" : "" ;
            return (
                <ListItem
                    key={t.id}
                    style={{padding: "0px"}}>
                    <Checkbox
                        size={"small"}
                        color={"primary"}
                        onChange={changeStatus}
                        checked={t.isDone}/>
                    <EditableSpan
                        title={t.title}
                        classes={taskClasses}
                        updateTitle={changeTaskTitle}
                    />
                    <IconButton
                        color={"secondary"}
                        size={"small"}
                        onClick={removeTask}>
                        <HighlightOff/>
                    </IconButton>
                </ListItem>
            )
        })
        : <span>List is empty</span>

    const changeFilter = (filter: FilterValuesType) => {
        dispatch(changeTodoListFilterAC(props.todoListID, filter))
    }
    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(changeTodoListTitleAC(props.todoListID, title))
    }, [])
    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(props.todoListID, title))
    }, [])
    const removeTodoList = () => {
        dispatch(removeTodoListAC(props.todoListID))
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} updateTitle={changeTodoListTitle}/>
                <IconButton
                    color={"secondary"}
                    size={"small"}
                    onClick={removeTodoList}>
                    <DeleteOutline/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} />
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
};