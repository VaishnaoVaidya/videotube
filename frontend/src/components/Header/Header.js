import React, { useContext, useEffect, useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineHistory } from "react-icons/md";
import { LuUserSquare } from "react-icons/lu";
import { BsCollectionPlayFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserSettings from "../UserSettings/UserSettings";
import UserContext from "../../context/UserContext";

const Header = () => {
  const host = "http://localhost:8000/api/v1";

  const navigate = useNavigate();
  const { signIn, setSignIn } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(false);
  const [refreshToken, setRefreshToken] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const { sidebar, setSidebar } = useContext(UserContext);
  const { userProfile, setUserProfile } = useContext(UserContext);
  // console.log("userprofileHeaders : " + JSON.stringify(userProfile));
  // console.log("userProfile : " + userProfile);
  // const subscriberId = userProfile._id

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if there's a stored access token in localStorage
        const accessToken = localStorage.getItem("accessToken");
        console.log("accessToken: " + accessToken);
        const response = await axios.get(`${host}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("UserProfile", response.data.data.user[0].email);
        console.log("success", response.data.data);

        if (response.data.success) {
          setSignIn(true);
          setUserProfile(response.data.data.user[0]);
          console.log("userProfile updated", response.data.data.user);
        } else if (response.data.status === 401) {
          // Access token expired; try refreshing it
          console.log("Access token expire");
          setRefreshToken(response.data.refreshToken);
          await refreshAccessToken();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setSignIn(false);
        setUserProfile("");
      }
    };
    fetchUser();
  }, []);

  //fetch subscriptions
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
   
    const subscriberId = userProfile._id

    // const {_id} = userProfile
    // console.log("subscriberId : " + _id);
    // const subscriberId = _id

    const fetchSubscriptions = async () => {

      

      const response = await axios.get(
        `http://localhost:8000/api/v1/subscriptions/u/${subscriberId}`,
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
    
      console.log("subscriptions of headers", response.data.data);
      setSubscriptions(response.data.data);
    };
    fetchSubscriptions();
  }, [userProfile]);

  //toDo: refresh token if acces token expire
  const refreshAccessToken = async () => {
    try {
      const refreshResponse = await axios.post(
        `${host}/users/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );

      if (refreshResponse.data.success) {
        const accessToken = refreshResponse.data.data.accessToken;
        setSignIn(true);
        console.log("Access token refreshed successfully.", accessToken);
      } else {
        console.error(
          "Failed to refresh access token:",
          refreshResponse.data.message
        );
        // Handle other error scenarios as needed
        if (refreshResponse.data.message === "jwt malformed") {
          console.error("JWT Malformed. Redirecting to sign-in page.");
          navigate("/signin");
          // TODO: Perform sign-out or other actions if needed
        }
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      setSignIn(false);
      setUserProfile("");
    }
  };

  const handleToggle = () => {
    setSidebar((toggle) => !toggle);
  };

  const handleUserDetails = () => {
    setUserDetails((user) => !user);
  };


  return (
    <div onClick={(e) => userDetails === true && setUserDetails(false)}>
      <div
        style={{
          height: "56px",
          width: "100%",
          listStyle: "none",
          position: "fixed",
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          paddingInline: 16,
          zIndex: 1000,
        }}
      >
        {/* Start Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <HiOutlineBars3
            style={{ cursor: "pointer" }}
            size={25}
            onClick={handleToggle}
          />
          <p
            style={{
              display: "flex",
              gap: 5,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingInline: 16,
              fontSize: 18,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <img
              src={"https://as2.ftcdn.net/v2/jpg/02/55/94/55/1000_F_255945532_gXYb4gPaatBY39i9KIte3K38KH3lJYIq.jpg"}
              style={{ height: 32, width: 43, marginTop: 3, cursor: "pointer", borderRadius: 10 }}
              alt=""
            />
            VIDEOTUBE
          </p>
        </div>

        {/* Center Section */}
        <div
          style={{
            display: "flex",
            width: "50%", // Adjusted width
            flexDirection: "row",
            alignItems: "center",
            fontSize: 16, // Adjusted font size
            fontWeight: "600",
            paddingInline: 24,
          }}
        >
          <input
            style={{
              height: "35px",
              width: "70%",
              listStyle: "none",
              border: "1px solid rgb(89 79 79)",
              borderTopLeftRadius: "35px",
              borderBottomLeftRadius: "35px",
              paddingLeft: "20px",
              backgroundColor: "hsl(0,0%,7%)",
              color: "#fff", // Adjusted color
              fontSize: "16px", // Adjusted font size
            }}
            id="search"
            autoComplete="off"
            type="text"
            placeholder="Search"
            aria-label="Search"
            // role="combobox"
            aria-haspopup="false"
            aria-autocomplete="list"
            dir="ltr"
            className="ytd-searchbox"
          />

          <button
            style={{
              height: "39px",
              display: "flex",
              background: "hsl(0,0%,18.82%)",
              border: "1px solid rgb(89 79 79)",
              borderTopRightRadius: "35px",
              borderBottomRightRadius: "35px",
              paddingLeft: "15px",
              paddingRight: "15px",
              textAlign: "center",
              color: "white",
              cursor: "pointer",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <IoIosSearch size={25} />
          </button>
          <div
            style={{
              height: "40px",
              width: "40px", // Adjusted width
              background: "hsl(0,0%,18.82%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "12px", // Adjusted marginInline
            }}
          >
            <MdKeyboardVoice style={{ cursor: "pointer" }} size={20} />{" "}
            {/* Adjusted size */}
          </div>
        </div>

        {/* End Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 40,
            fontSize: 22,
            fontWeight: "600",
          }}
        >
          {signIn ? (
            userProfile && (
              <>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to={`/channel/upload`}
                >
                  <MdOutlineVideoCall
                    style={{ padding: 8, cursor: "pointer" }}
                    size={30}
                  />
                </Link>
                <IoMdNotificationsOutline
                  style={{ padding: 8, cursor: "pointer" }}
                  size={30}
                />
                <img
                  onClick={handleUserDetails}
                  src={userProfile?.avatar || "images/unknown.png"}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255)",
                    cursor: "pointer",
                  }}
                  alt={""}
                />
              </>
            )
          ) : (
            <>
              <BsThreeDotsVertical
                onClick={handleUserDetails}
                style={{ paddingRight: 13, cursor: "pointer" }}
              />
              <Link
                to="/signin"
                style={{
                  textDecoration: "none",
                }}
              >
                <p
                  style={{
                    border: "1px solid gray",
                    paddingInline: 15,
                    display: "flex",
                    borderRadius: "30px",
                    fontSize: 14,
                    justifyContent: "center",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "#4f8ed4",
                  }}
                >
                  <FaRegUserCircle
                    style={{ padding: 8, paddingInline: 4 }}
                    size={20}
                  />{" "}
                  SignIn
                </p>
              </Link>
            </>
          )}

          <>
            {/* // toggle user details */}

            <UserSettings
              userDetails={userDetails}
              userProfile={userProfile}
              handleUserDetails={handleUserDetails}
            />
          </>
        </div>
      </div>

      <div>{/* TODo: tags  */}</div>

      {sidebar ? (
        <>
          <section
            style={{
              width: 200,
              height: "100vh",
              position: "absolute",
              marginTop: 56,
              color: "#fff",
              padding: "20px",
              overflowY: "hidden",
              position: "fixed",
              zIndex: 1000,
              overflowY: "auto",
              scrollbarColor: "black",
              scrollbarWidth: "thin",
              backgroundColor: "rgb(0, 0, 0)",
              // WebkitOverflowScrolling: "touch", // Enable smooth scrolling in WebKit browsers
              // '&::-webkit-scrollbar': {
              //   backgroundColor: "rgb(0, 0, 0)",
                // Set background color of the scrollbar
              // }
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Link
                to="/"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <li
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    fontSize: 18,
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <IoMdHome style={{ paddingRight: 20 }} size={25} />
                  Home
                </li>
              </Link>
              <Link
                to="/likedVideos"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <li
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    fontSize: 18,
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <AiOutlineLike style={{ paddingRight: 20 }} size={25} />
                  Liked Videos
                </li>
              </Link>
              <Link
                to="/history"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <li
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    fontSize: 18,
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <MdOutlineHistory style={{ paddingRight: 20 }} size={25} />
                  History
                </li>
              </Link>
              <Link
                to={`/channel/${userProfile?.username}`}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <li
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    fontSize: 18,
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <LuUserSquare style={{ paddingRight: 20 }} size={25} />
                  Your Channel
                </li>
              </Link>
              <Link
                to="/collections"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <li
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    fontSize: 18,
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <BsCollectionPlayFill
                    style={{ paddingRight: 20 }}
                    size={25}
                  />
                  Collections
                </li>
              </Link>
              <Link
                to="/subscriptions"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <li
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    fontSize: 18,
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <></>
                  Subscriptions
                </li>
              </Link>

              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  fontSize: 18,
                  padding: 10,
                  borderRadius: "10px",
                  flexDirection: "column", // Removed duplicate 'display: "flex"'
                  justifyContent: "flex-start",
                }}
              >
                {subscriptions.map((subscription, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: -25,
                    }}
                  >
                    {" "}
                    {/* Changed flexDirection to alignItems */}
                    <img
                      src={subscription.subscriber.avatar}
                      style={{ width: 30, height: 30, borderRadius: "50%" }}
                      alt=""
                    />
                    <h6>
                      {subscription.subscriber.fullName ||
                        subscription.subscriber.username}
                    </h6>
                  </div>
                ))}
              </div>

            </ul>
          </section>
        </>
      ) : (
        <>
          <section
            style={{
              width: 80, // Adjust the width as needed
              height: "100vh",
              position: "fixed",
              marginTop: 56, // Adjust the padding as needed
              backgroundColor: "rgb(0, 0, 0)", // Sidebar background color
              color: "#fff", // Text color
              zIndex: 1000,
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Link
                to="/"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 10,
                    justifyContent: "center",
                    marginBottom: "10px",
                    display: "flex",
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <IoMdHome style={{}} size={25} />
                  Home
                </li>
              </Link>
              <Link
                to="/likedvideos"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 10,
                    justifyContent: "center",
                    marginBottom: "10px",
                    display: "flex",
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <AiOutlineLike style={{}} size={25} />
                  Liked Videos
                </li>
              </Link>
              <Link
                to="/history"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 10,
                    justifyContent: "center",
                    marginBottom: "10px",
                    display: "flex",
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <MdOutlineHistory style={{}} size={25} />
                  History
                </li>
              </Link>
              <Link
                to={`/channel/${userProfile?.username}`}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 10,
                    justifyContent: "center",
                    marginBottom: "10px",
                    display: "flex",
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <LuUserSquare style={{}} size={25} />
                  Your Channel
                </li>
              </Link>
              <Link
                to="/collections"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 10,
                    justifyContent: "center",
                    marginBottom: "10px",
                    display: "flex",
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <BsCollectionPlayFill style={{}} size={25} />
                  Collections
                </li>
              </Link>
              <Link
                to="subscriptions"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 10,
                    justifyContent: "center",
                    marginBottom: "10px",
                    display: "flex",
                    padding: 10,
                    borderRadius: "10px",
                  }}
                >
                  <></>
                  Subscriptions
                  {}
                </li>
              </Link>
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default Header;
