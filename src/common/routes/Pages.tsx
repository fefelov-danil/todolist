import React from 'react';
import {authSelectors, Login} from "features/auth";
import {useSelector} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import {TodoLists} from "features/todolists";
import {PageNotFound} from "common/404";
import {About} from "features/informationPages/About";

export const PATH = {
  LOGIN: '/login',
  TODOLIST: '/todolist',
  ABOUT: '/about'
}

export const Pages = () => {
  const isVerifyLogin = useSelector(authSelectors.selectVerifyLogin)

  return (
    <Routes>
      {isVerifyLogin ? (
        <>
          <Route path={'/'} element={<TodoLists/>}/>
          <Route path={PATH.TODOLIST} element={<Navigate to={'/'}/>}/>
        </>
      ) : (
        <>
          <Route path={'/'} element={<Login/>}/>
          <Route path={PATH.LOGIN} element={<Login/>}/>
        </>
      )}
      <Route path={PATH.ABOUT} element={<About />} />
      <Route path={'/404'} element={<PageNotFound/>}/>
      <Route path={'*'} element={<Navigate to={'/404'}/>}/>
    </Routes>
  )
};