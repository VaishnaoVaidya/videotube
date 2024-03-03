import React from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children}) => {
    const [signIn, setSignIn] = React.useState(false);
    const [sidebar, setSidebar] = React.useState(false);
    const [userProfile, setUserProfile] = React.useState([]);

    return (
        <UserContext.Provider value={{signIn, setSignIn, sidebar, setSidebar, userProfile, setUserProfile}}>
            {children}
        </UserContext.Provider>
    )
} 

export default UserContextProvider;