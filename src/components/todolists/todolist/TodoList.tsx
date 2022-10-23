import React, {useCallback, useEffect} from 'react';
import s from './Todolist.module.css'
import {AddItemForm} from "components/addItemForm/AddItemForm";
import {EditableSpan} from "components/editableSpan/EditableSpan";
import {Task} from "components/todolists/todolist/task/Task";
import {FilterValuesType, TaskStatuses} from "api/todoListsAPI";
import {useAppSelector} from "app/hooks";
import IconButton from '@mui/material/IconButton/IconButton';
import {DeleteOutline} from "@mui/icons-material";
import {Button, List} from "@mui/material";
import {RequestStatusType} from "app/app-reducer";
import {tasksActions, todoListsActions, todosSelectors} from "components/todolists/index";
import {useActions} from "app/store";
import {authSelectors} from "components/features/auth";

type TodoListPropsType = {
    todoListID: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const TodoList = React.memo( (props: TodoListPropsType) => {
    const tasks = useAppSelector(todosSelectors.selectTasks)[props.todoListID]
    const isVerifyLogin = useAppSelector(authSelectors.selectVerifyLogin)
    const {addTask, fetchTasks} = useActions(tasksActions)
    const {removeTodolist, changeTodolistTitle, changeTodoListFilter} = useActions(todoListsActions)

    useEffect(() => {
        if(isVerifyLogin) {
            fetchTasks(props.todoListID)
        }
    }, [isVerifyLogin])

    const removeTodoListHandler = useCallback( () => {
        removeTodolist(props.todoListID)
    }, [props.todoListID])

    const changeFilterHandler = useCallback( (filter: FilterValuesType) => {
        changeTodoListFilter( {id: props.todoListID, filter} )
    }, [props.todoListID])

    const changeTodoListTitleHandler = useCallback( (title: string) => {
        changeTodolistTitle({todolistId: props.todoListID, title})
    }, [props.todoListID])

    const addTaskHandler = useCallback((title: string) => {
        addTask({todolistId: props.todoListID, title})
    }, [props.todoListID])

    const renderFilterButton = (filter: FilterValuesType) => {
        return <Button
            size={"small"}
            color={props.filter === filter ? "secondary" : "primary"}
            variant={"contained"}
            disableElevation
            onClick={() => changeFilterHandler(filter)}>{filter}</Button>
    }

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

    return (
        <div className={s.todolist}>
            <h3>
                <EditableSpan
                    title={props.title}
                    updateTitle={changeTodoListTitleHandler}
                    disabled={props.entityStatus === 'loading'}/>
                <IconButton
                    color={"secondary"}
                    size={"small"}
                    disabled={props.entityStatus === 'loading'}
                    onClick={removeTodoListHandler}>
                    <DeleteOutline/>
                </IconButton>
            </h3>
            <AddItemForm
                addItem={addTaskHandler}
                disabled={props.entityStatus === 'loading'}
                />
            <List>
                {tasksJSXElements}
            </List>
            <div>
                {renderFilterButton('all')}
                {renderFilterButton('active')}
                {renderFilterButton('completed')}
            </div>
        </div>
    );
} );