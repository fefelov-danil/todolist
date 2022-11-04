import React from 'react';
import s from 'components/header/Header.module.css'
import {Nav} from "components/header/nav/Nav";

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