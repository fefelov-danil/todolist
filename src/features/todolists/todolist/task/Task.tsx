import React, {ChangeEvent, useCallback} from 'react';
import s from 'features/todolists/todolist/task/Task.module.css'
import {EditableSpan} from "common/editableSpan/EditableSpan";
import {TaskDomainType, TaskStatuses} from "api/todoListsAPI";
import {Checkbox, ListItem} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {tasksActions} from "features/todolists/index";
import {useActions} from "utils/redux-utils";

type TaskPropsType = {
    todoListID: string
    task: TaskDomainType
}

export const Task = React.memo( (props: TaskPropsType) => {
    const {removeTask, updateTask} = useActions(tasksActions)

    const removeTaskHandler = useCallback( () => {
        removeTask({todolistId: props.todoListID, taskId: props.task.id})
    }, [props.todoListID, props.task.id])

    const changeTaskStatusHandler = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            todolistId: props.todoListID,
            taskId: props.task.id,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}
        })
    }, [props.todoListID, props.task.id])

    const changeTaskTitleHandler = useCallback( (title: string) => {
        updateTask({todolistId: props.todoListID, taskId: props.task.id, domainModel: {title}})
    }, [props.todoListID, props.task.id])

    return (
        <ListItem className={s.task} sx={{padding: '3px 3px 3px 1px '}}>
            <Checkbox
                sx={{padding: '3px', marginRight: '2px'}}
                size={"small"}
                color={"primary"}
                onChange={changeTaskStatusHandler}
                checked={props.task.status === TaskStatuses.Completed}
                disabled={props.task.entityStatus === "loading"}/>
            <EditableSpan
                size={'small'}
                value={props.task.title}
                updateTitle={changeTaskTitleHandler}
                disabled={props.task.entityStatus === "loading"}
            />
            <button
                className={s.iconDeleteTask}
                onClick={removeTaskHandler}
                disabled={props.task.entityStatus === "loading"}>
                <CloseIcon
                    className={props.task.entityStatus === "loading" ? s.disabledIcon : ''}
                    sx={{ fontSize: 17 }}/>
            </button>
        </ListItem>
    );
} );