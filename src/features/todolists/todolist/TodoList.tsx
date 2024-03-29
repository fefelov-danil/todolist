import React, {useCallback, useEffect} from 'react';
import s from 'features/todolists/todolist/Todolist.module.css';
import {AddItemForm} from "common/addItemForm/AddItemForm";
import {EditableSpan} from "common/editableSpan/EditableSpan";
import {Task} from "features/todolists/todolist/task/Task";
import {FilterValuesType, TaskStatuses} from "api/todoListsAPI";
import IconButton from '@mui/material/IconButton/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Button, List} from "@mui/material";
import {RequestStatusType} from "app/reducers/app-reducer";
import {tasksActions, todoListsActions, todosSelectors} from "features/todolists/index";
import {authSelectors} from "features/auth";
import {useActions} from "utils/redux-utils";
import {useSelector} from "react-redux";

type TodoListPropsType = {
  todoListID: string
  title: string
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const TodoList = React.memo((props: TodoListPropsType) => {
  const tasks = useSelector(todosSelectors.selectTasks)[props.todoListID]
  const isVerifyLogin = useSelector(authSelectors.selectVerifyLogin)
  const {addTask, fetchTasks} = useActions(tasksActions)
  const {removeTodolist, changeTodolistTitle, changeTodoListFilter} = useActions(todoListsActions)

  useEffect(() => {
    if (isVerifyLogin) {
      const test = async () => {
        await fetchTasks(props.todoListID)
      }
      test()
    }
  }, [isVerifyLogin])

  const removeTodoListHandler = useCallback(() => {
    removeTodolist(props.todoListID)
  }, [props.todoListID])

  const changeFilterHandler = useCallback((filter: FilterValuesType) => {
    changeTodoListFilter({id: props.todoListID, filter})
  }, [props.todoListID])

  const changeTodoListTitleHandler = useCallback((title: string) => {
    changeTodolistTitle({todolistId: props.todoListID, title})
  }, [props.todoListID])

  const addTaskHandler = useCallback((title: string) => {
    addTask({todolistId: props.todoListID, title})
  }, [props.todoListID])

  const renderFilterButton = (filter: FilterValuesType) => {
    return <Button
      size={"small"}
      color={props.filter === filter ? "primary" : "inherit"}
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
    : <div className={s.noTasks}>List is empty</div>

  const disabled = props.entityStatus === 'loading'

  return (
    <div className={s.todolist}>
      <p className={s.todoTitle}>
        <EditableSpan
          size={'big'}
          value={props.title}
          updateTitle={changeTodoListTitleHandler}
          disabled={disabled}/>
        <IconButton
          className={s.removeTodo}
          size={"small"}
          disabled={disabled}
          onClick={removeTodoListHandler}>
          <CloseIcon className={disabled ? s.disabledIcon : ''} sx={{color: '#fff'}}/>
        </IconButton>
      </p>
      <AddItemForm
        addItem={addTaskHandler}
        value={'Add a new task'}
        disabled={props.entityStatus === 'loading'}
      />
      <List sx={{padding: '12px 0'}}>
        {tasksJSXElements}
      </List>
      {tasks.length
        ? <div className={s.filterButtons}>
          {renderFilterButton('all')}
          {renderFilterButton('active')}
          {renderFilterButton('completed')}
        </div>
        : ''
      }
    </div>
  );
});