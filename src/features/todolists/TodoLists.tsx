import React from 'react';
import s from 'features/todolists/TodoLists.module.css'
import {AddItemForm} from "common/addItemForm/AddItemForm";
import {TodoList} from "features/todolists/todolist/TodoList";
import {todoListsAsyncActions} from "features/todolists/reducers/todolists-reducer";
import {selectTodoLists} from "features/todolists/selectors";
import {useActions} from "utils/redux-utils";
import {useSelector} from "react-redux";

export const TodoLists = () => {
  const todoLists = useSelector(selectTodoLists)
  const {addTodolist} = useActions(todoListsAsyncActions)

  //GUI:
  const todoListsComponents = todoLists.length
    ? todoLists.map(tl => {
      return (
        <TodoList
          key={tl.id}
          todoListID={tl.id}
          filter={tl.filter}
          title={tl.title}
          entityStatus={tl.entityStatus}/>
      )
    })
    : ''
  return (
    <div className={s.todoLists}>
      {todoListsComponents}
      <div className={s.addingTodos}>
        {!todoLists.length && <div className={s.firstTodolist}>Create your first TodoList!</div>}
        <div className={s.addTodolist}>
          <AddItemForm
            value={'Add a new todolist'}
            addItem={addTodolist}/>
        </div>
      </div>
    </div>
  );
};