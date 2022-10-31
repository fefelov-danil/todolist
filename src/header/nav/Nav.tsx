import React, {useEffect, useRef, useState} from 'react';
import s from "header/nav/Nav.module.css"
import {NavLink} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import {useAppSelector} from "app";
import {authActions, authSelectors} from "components/features/auth";
import {useActions} from "utils/redux-utils";

export const Nav = React.memo(() => {
    const isVerifyLogin = useAppSelector(authSelectors.selectVerifyLogin)
    const {logoutTC} = useActions(authActions)

    const logoutHandler = () => {
        logoutTC()
    }

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

    return (
        <div ref={menu} className={s.nav}>
            <div
                className={openMenu
                     ? `${s.menu} ${s.menuIsOpened}`
                     : `${s.menu} ${s.menuIsClosed}`}>
                <ul>
                    <li><NavLink to={'/'} onClick={() => setOpenMenu(false)}>Ссылка 1</NavLink></li>
                    <li><NavLink to={'/'} onClick={() => setOpenMenu(false)}>Ссылка 2</NavLink></li>
                    <li><NavLink to={'/'} onClick={() => setOpenMenu(false)}>Ссылка 3</NavLink></li>
                </ul>
                {isVerifyLogin &&
                    <p className={s.logout}>
                        <button onClick={logoutHandler}>
                            <span>Logout</span>
                            <LogoutIcon sx={{ color: '#3C3C3C', fontSize: 20 }}/>
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