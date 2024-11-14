import React from 'react'
import axios, { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";


const useLogout = () => {
    const {setAuth} =useAuth();

    const logout =async() =>{
        setAuth({});
        try{
            const response =await axiosPrivate('/logout',{
                withCredentials:true 
            });
            console.log(response);
        } catch(err){
            console.log(err);
        }
    }
  return logout;
}

export default useLogout