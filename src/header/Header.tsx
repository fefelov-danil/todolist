import React from 'react';
import s from './Header.module.css'
import LinearProgress from "@mui/material/LinearProgress";
import {appSelectors, useAppSelector} from "app";
import {Nav} from "header/nav/Nav";

export const Header = () => {

    return (
        <div>
            <header className={s.header}>
                <p className={s.projectName}>Pet проект - TodoList</p>
                <Nav/>
            </header>
        </div>
    );
};