import React from 'react';
import s from './TodoLists.module.css'
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
                <TodoList
                    todoListID={tl.id}
                    filter={tl.filter}
                    title={tl.title}
                    entityStatus={tl.entityStatus}/>
            )
        })
        : <span>Create your first TodoList!</span>

    return (
        <div className={s.todoLists}>
            {todoListsComponents}
            <AddItemForm addItem={addTodolist}/>
        </div>
    );
};