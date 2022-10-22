import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from "components/editableSpan/EditableSpan";
import {TaskDomainType, TaskStatuses} from "api/todoListsAPI";
import {Checkbox, ListItem} from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import {HighlightOff} from "@mui/icons-material";
import {useActions} from "app/store";
import {tasksActions} from "components/todolists/index";

type TaskPropsType = {
    todoListID: string
    task: TaskDomainType
}

export const Task = React.memo( (props: TaskPropsType) => {
    const {removeTask, updateTask} = useActions(tasksActions)

    const removeTaskHandler = useCallback( () => {
        removeTask({todolistId: props.todoListID, taskId: props.task.id})
    }, [props.todoListID, props.task.id])

    const changeStatusHandler = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({todolistId: props.todoListID, taskId: props.task.id, domainModel: {status}})
    }, [props.todoListID, props.task.id])

    const changeTaskTitleHandler = useCallback( (title: string) => {
        updateTask({todolistId: props.todoListID, taskId: props.task.id, domainModel: {title}})
    }, [props.todoListID, props.task.id])

    const taskClasses = props.task.status === TaskStatuses.Completed ? "is-done" : "" ;

    return (
        <ListItem
            style={{padding: "0px"}}>
            <Checkbox
                size={"small"}
                color={"primary"}
                onChange={changeStatusHandler}
                checked={props.task.status === TaskStatuses.Completed}
                disabled={props.task.entityStatus === "loading"}/>
            <EditableSpan
                title={props.task.title}
                classes={taskClasses}
                updateTitle={changeTaskTitleHandler}
                disabled={props.task.entityStatus === "loading"}
            />
            <IconButton
                color={"secondary"}
                size={"small"}
                onClick={removeTaskHandler}
                disabled={props.task.entityStatus === "loading"}>
                <HighlightOff/>
            </IconButton>
        </ListItem>
    );
} );