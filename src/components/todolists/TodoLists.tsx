import React from 'react';
import s from './TodoLists.module.css'
import {AddItemForm} from "components/addItemForm/AddItemForm";
import {TodoList} from "components/todolists/todolist/TodoList";
import {useAppSelector} from "app/hooks";
import {useActions} from "app/store";
import {todoListsAsyncActions} from "components/todolists/reducers/todolists-reducer";
import {selectTodoLists} from "components/todolists/selectors";

export const TodoLists = () => {
    const todoLists = useAppSelector(selectTodoLists)
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
            <div>
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