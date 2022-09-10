import React from 'react';
import s from './PageNotFound.module.css'

export const PageNotFound = () => {
    return (
        <div className={s.errorNotFound}>
            <h1>404. Страница не найдена</h1>
        </div>
    );
};