import React from 'react';
import {authSelectors, Login} from "features/auth";
import {useSelector} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import {TodoLists} from "features/todolists";
import {PageNotFound} from "common/404";
import {About} from "features/informationPages/about/About";
import {PrivateAuth} from "utils/hoc/PrivateAuth";
import {Profile} from "features/informationPages/profile/Profile";

export const PATH = {
  TODOLIST: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  ABOUT: '/about'
}

export const Pages = () => {
  const isVerifyLogin = useSelector(authSelectors.selectVerifyLogin)

  return (
    <Routes>
      <Route path={PATH.TODOLIST} element={
        <PrivateAuth isVerifyLogin={isVerifyLogin}>
          <TodoLists/>
        </PrivateAuth>
      }/>
      <Route path={PATH.LOGIN} element={
        <PrivateAuth isVerifyLogin={!isVerifyLogin} defaultPath={PATH.TODOLIST}>
          <Login/>
        </PrivateAuth>
      }/>
      <Route path={PATH.PROFILE} element={
        <PrivateAuth isVerifyLogin={!isVerifyLogin}>
          <Profile />
        </PrivateAuth>
      } />
      <Route path={PATH.ABOUT} element={<About />} />
      <Route path={'/404'} element={<PageNotFound/>}/>
      <Route path={'*'} element={<Navigate to={'/404'}/>}/>
    </Routes>
  )
};