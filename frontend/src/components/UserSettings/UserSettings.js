import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiSignOut } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import UserContext from "../../context/UserContext";

const UserSettings = ({ userDetails, userProfile, handleUserDetails }) => {
  const navigate = useNavigate();
  const { signIn } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  if (!userDetails) {
    return null;
  }

  return (
    <div className="user-menu" onClick={handleUserDetails}>
      {userProfile ? (
        <div className="user-menu__header">
          <img src={userProfile.avatar || "images/unknown.png"} alt={userProfile.fullName} />
          <div>
            <strong>{userProfile.fullName}</strong>
            <p style={{ margin: "4px 0", color: "#94a3b8" }}>@{userProfile?.username}</p>
            <Link to={`/channel/${userProfile?.username}`} style={{ color: "#fb923c" }}>
              View your channel
            </Link>
          </div>
        </div>
      ) : null}

      <div className="user-menu__body">
        {signIn ? (
          <button type="button" onClick={handleSignOut}>
            <PiSignOut size={20} />
            Sign out
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            handleUserDetails();
            navigate("/settings/profile");
          }}
        >
          <IoSettingsOutline size={20} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
