import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditableSpan} from "editableSpan/EditableSpan";
import {HighlightOff} from "@material-ui/icons";
import {removeTaskTC, updateTaskTC} from "reducers/tasks-reducer";
import {TaskStatuses, TaskType} from "api/todoListsAPI";
import {useAppDispatch} from "hooks/hooks";

type TaskPropsType = {
    todoListID: string
    task: TaskType
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
                checked={props.task.status === TaskStatuses.Completed}/>
            <EditableSpan
                title={props.task.title}
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
    );
} );