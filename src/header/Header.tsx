import React from 'react';
import s from './Header.module.css'
import {Nav} from "header/nav/Nav";

export const Header = () => {

    return (
        <div>
            <header className={s.header}>
                <p className={s.projectName}>Pet project - TodoList</p>
                <Nav/>
            </header>
        </div>
    );
};