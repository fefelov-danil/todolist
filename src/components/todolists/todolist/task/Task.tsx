import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from "components/editableSpan/EditableSpan";
import {removeTaskTC, updateTaskTC} from "components/todolists/reducers/tasks-reducer";
import {TaskDomainType, TaskStatuses} from "api/todoListsAPI";
import {useAppDispatch} from "app/hooks";
import {Checkbox, ListItem} from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import {HighlightOff} from "@mui/icons-material";

type TaskPropsType = {
    todoListID: string
    task: TaskDomainType
}

export const Task = React.memo( (props: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const removeTask = useCallback( () => {
        dispatch(removeTaskTC(props.todoListID, props.task.id))
    }, [props.todoListID, props.task.id])

    const changeStatus = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(props.todoListID, props.task.id, {status}))
    }, [props.todoListID, props.task.id])

    const changeTaskTitle = useCallback( (title: string) => {
        dispatch(updateTaskTC(props.todoListID, props.task.id, {title}))
    }, [props.todoListID, props.task.id])

    const taskClasses = props.task.status === TaskStatuses.Completed ? "is-done" : "" ;

    return (
        <ListItem
            style={{padding: "0px"}}>
            <Checkbox
                size={"small"}
                color={"primary"}
                onChange={changeStatus}
                checked={props.task.status === TaskStatuses.Completed}
                disabled={props.task.entityStatus === "loading"}/>
            <EditableSpan
                title={props.task.title}
                classes={taskClasses}
                updateTitle={changeTaskTitle}
                disabled={props.task.entityStatus === "loading"}
            />
            <IconButton
                color={"secondary"}
                size={"small"}
                onClick={removeTask}
                disabled={props.task.entityStatus === "loading"}>
                <HighlightOff/>
            </IconButton>
        </ListItem>
    );
} );