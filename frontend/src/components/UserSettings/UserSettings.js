import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { PiSignOut } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import UserContext from '../../context/UserContext';

const UserSettings = (props) => {
    const {userDetails, userProfile, handleUserDetails} = props;
    const navigate = useNavigate()
    const { signIn} = useContext(UserContext)


    const handleSignOut = () => {
      localStorage.removeItem('accessToken' , "")
      alert("Do you want to sign out")
      navigate("/signin")
    }
  return (
    <div onClick={handleUserDetails}>
    {userDetails && (
              <>
                <div
                  style={{
                    height: "auto",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    position: "absolute", 
                    right: 90,
                    top: 10,
                    background: "#242121",
                    color: "white",
                  }}
                >
                  {userProfile && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingRight: 80,
                        paddingTop: 7,
                        marginTop: 7,
                        alignItems: "flex-start",
                      }}
                    >
                      <img
                        src={userProfile.avatar || "images/unknown.png"}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          paddingRight: 10,
                        }}
                        alt={""}
                      />
                      <div style={{ margin: "0px 0" }}>
                        <h6 style={{ margin: 0 }}>{userProfile.fullName}</h6>
                        <h6 style={{ margin: "1px", marginLeft: "2px" }}>
                          @{userProfile?.username}
                        </h6>
                        <Link
                          style={{ margin: 0, textDecoration: "none" }}
                          to={`/channel/${userProfile?.username}`}
                        >
                          <p style={{ paddingTop: 2, color: "#0999ff",textDecoration: "none" , fontSize: 13}}>
                            View your channel
                          </p>
                        </Link>
                      </div>
                    </div>
                  )}
                  <hr style={{ color: "white", width: "95%" }} />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: 2,
                      paddingLeft: 20,
                      gap: 0,
                      alignSelf: "flex-start",
                      fontWeight: "400",
                      fontSize: 19,
                      textAlign: "center",
                    }}
                  >
                   {signIn && 
                   <>
                    <li
                    onClick={handleSignOut}
                      style={{
                        paddingBottom: 7,
                        alignSelf: "center",
                        display: "flex",
                        margin: 2,
                        cursor: "pointer",
                      }}
                    >
                      <PiSignOut style={{ paddingRight: 4 }} size={25} />
                      SignOut
                    </li>
                    </>}
                    <li
                      style={{
                        paddingBottom: 7,
                        alignSelf: "center",
                        display: "flex",
                        margin: 2,
                      }}
                    >
                      <IoSettingsOutline
                        style={{ paddingRight: 4 }}
                        size={25}
                      />
                      Settings
                    </li>
                  </div>
                </div>
              </>
            )}
    </div>
  )
}

export default UserSettings