import React from 'react'
import {Link} from 'react-router-dom'
import { PiSignOut } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";

const UserSettings = (props) => {
    const {userDetails, userProfile} = props;
  return (
    <div>
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
                    top: 10,
                    borderRadius: 5,
                    right: 90,
                    position: "absolute",
                    background: "#242121",
                    color: "white",
                  }}
                >
                  {userProfile && userProfile.data && (
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
                        src={userProfile.data.avatar || "images/unknown.png"}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          paddingRight: 10,
                        }}
                        alt={""}
                      />
                      <div style={{ margin: "0px 0" }}>
                        <h6 style={{ margin: 0 }}>{userProfile.data.email}</h6>
                        <h6 style={{ margin: "1px", marginLeft: "2px" }}>
                          @{userProfile.data.username}
                        </h6>
                        <Link
                          style={{ margin: 0, textDecoration: "none" }}
                          to={`/channel/${userProfile.data.username}`}
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
                    <li
                      style={{
                        paddingBottom: 7,
                        alignSelf: "center",
                        display: "flex",
                        margin: 2,
                      }}
                    >
                      <PiSignOut style={{ paddingRight: 4 }} size={25} />
                      SignOut
                    </li>
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