import React from 'react'
import { useLocation,Navigate,Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({allowedRoles}) => {
  console.log(allowedRoles);
    const {auth}=useAuth();
    const location =useLocation();
    const rolesArray = auth?.roles ? Object.values(auth.roles) : []; // Object.values for 2001,5150   and Object.keys for Admin,User
    // console.log(rolesArray);
  return (
        rolesArray?.find(role=>allowedRoles?.includes(role))
        ? <Outlet/>
        :auth?.accessToken //changed from user to accessToken to persist login after refresh
            ?<Navigate to="/unauthorized" state={{from :location}} replace  />
            :<Navigate to="/login" state={{from :location}} replace  />
  )
}

export default RequireAuth;