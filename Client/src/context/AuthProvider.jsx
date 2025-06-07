import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        roles: null,
        accessToken: null,
        _id:null,
        email: null,
        userName:null
    });

    const setAuthInfo = ({ accessToken }, email, roles,userName,_id) => {
        setAuth({
            isAuthenticated: !!accessToken,
            accessToken,
            email,
            roles,
            _id,
            userName
        });
    };
    const [persist ,setPersist] =useState(
          localStorage.getItem("persist")=="undefined" ?true :JSON.parse(localStorage.getItem("persist")));

    return (
        <AuthContext.Provider value={{ auth,setAuth,setAuthInfo, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
