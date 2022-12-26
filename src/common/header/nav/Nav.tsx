import React, {useEffect, useRef, useState} from 'react';
import s from "common/header/nav/Nav.module.css"
import {NavLink} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import {authActions, authSelectors} from "features/auth";
import {useActions} from "utils/redux-utils";
import {useSelector} from "react-redux";
import {PATH} from "common/routes/Pages";

export const Nav = React.memo(() => {
  const isVerifyLogin = useSelector(authSelectors.selectVerifyLogin)
  const {logoutTC} = useActions(authActions)

  const [openMenu, setOpenMenu] = useState(false)

  const menu = useRef(null as HTMLDivElement | null)

  useEffect(() => {
    if (!openMenu) return

    const handleClick = (e: any) => {
      if (!menu.current) return
      if (!menu.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [openMenu])

  const logoutHandler = () => {
    logoutTC()
    setOpenMenu(false)
  }

  return (
    <div ref={menu} className={s.nav}>
      <div
        className={openMenu
          ? `${s.menu} ${s.menuIsOpened}`
          : `${s.menu} ${s.menuIsClosed}`}>
        <ul>
          <li>
            {isVerifyLogin ? (
              <NavLink to={PATH.TODOLIST} onClick={() => setOpenMenu(false)}>TodoList</NavLink>
            ) : (
              <NavLink to={PATH.LOGIN} onClick={() => setOpenMenu(false)}>Login</NavLink>
            )}
          </li>
          <li><NavLink to={PATH.ABOUT} onClick={() => setOpenMenu(false)}>About</NavLink></li>
        </ul>
        {isVerifyLogin &&
            <p className={s.logout}>
                <button onClick={logoutHandler}>
                    <span>Logout</span>
                    <LogoutIcon sx={{color: '#3C3C3C', fontSize: 20}}/>
                </button>
            </p>

        }
      </div>
      <div onClick={() => setOpenMenu(!openMenu)}
           className={!openMenu
             ? `${s.headerMenu} ${s.animationReverse}`
             : `${s.headerMenu} ${s.mobileMenuActive}`}>
        <div className={s.headerBurger}>
          <div className={s.burger}>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
});