import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({allowedRoles}) => {
    const location=useLocation();
    const {auth} = useAuth();
    const rolesArray = typeof auth?.roles === 'string' 
        ? [auth.roles] 
        : (auth?.roles ? Object.values(auth.roles) : []);

    return (
        rolesArray?.find(role => allowedRoles?.includes(role))
        ? <Outlet/>
        : auth?.accessToken
            ? <Navigate to="/unauthorized" state={{from: location}} replace />
            : <Navigate to="/login" state={{from: location}} replace />
    )
}

export default RequireAuth;