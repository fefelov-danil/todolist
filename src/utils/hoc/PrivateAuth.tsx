import React, {FC} from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {PATH} from "common/routes/Pages";
import {IsVerifyLoginType} from "features/auth/auth-reducer";

type PrivateAuthPropsType = {
  isVerifyLogin: IsVerifyLoginType
  children: React.ReactNode
  defaultPath?: string
}

export const PrivateAuth: FC<PrivateAuthPropsType> = ({isVerifyLogin, children, defaultPath}) => {
  const location = useLocation()

  if (!isVerifyLogin) {
    return <Navigate
      to={defaultPath ? defaultPath : PATH.LOGIN}
      state={ {from: location.pathname} }
      replace={true} />
  }

  return <>{children}</>
};