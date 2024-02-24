import React from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children}) => {
    const [signIn, setSignIn] = React.useState(false);
    const [sidebar, setSidebar] = React.useState(false);

    return (
        <UserContext.Provider value={{signIn, setSignIn, sidebar, setSidebar}}>
            {children}
        </UserContext.Provider>
    )
} 

export default UserContextProvider;