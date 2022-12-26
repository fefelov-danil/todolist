import React from 'react';
import s from 'common/header/Header.module.css'
import {Nav} from "common/header/nav/Nav";

export const Header = () => {

  return (
    <div>
      <header className={s.header}>
        <p className={s.projectName}>TodoList</p>
        <Nav/>
      </header>
    </div>
  );
};