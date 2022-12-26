import React from 'react';
import {NavLink} from "react-router-dom";
import {PATH} from "common/routes/Pages";

export const Profile = () => {
  return (
    <div className={'information'}>
      <h1>Hello!</h1>
      <NavLink to={PATH.TODOLIST} >Todolists</NavLink>
    </div>
  );
};