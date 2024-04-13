import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { formatDistanceToNow } from "date-fns";

const Subscriptions = () => {
  const [videos, setVideos] = useState([]);
  const [subscriptionsVideos, setSubscriptionsVideos] = useState([]);
  const { sidebar, setSidebar } = useContext(UserContext);
  // const { userProfile } = useContext(UserContext);
  const { userProfile, setUserProfile } = useContext(UserContext);
  console.log("userprofileHeaders : " + JSON.stringify(userProfile));
  console.log("userProfile : " + userProfile);

  //fetch subscriptions
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (userProfile) {
      console.log("Subscriber ID:", userProfile._id); // Log the _id property
          const subscriberId = userProfile._id

    } else {
      console.log("User profile not available");
    }
    const subscriberId = userProfile._id

    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/subscriptions/u/${subscriberId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
  
        console.log("subscriptions of headers", response.data.data);
        // console.log("subscriptions videos of headers", response.data.data.videos);
  
        // Assuming response.data.data is an array of objects where each object contains a 'videos' array
  
        // Flatten the array of videos from all objects into a single array
        const allVideos = response.data.data.flatMap((item) => item.videos);
  
        // Sort the videos by their createdAt timestamps in descending order
        const sortedVideos = allVideos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
  
        // Now, sortedVideos contains all videos sorted by latest createdAt timestamp
        // You can set it to your state variable or use it directly in your UI
        setSubscriptionsVideos(sortedVideos);
          console.log("sortedVideos: " + sortedVideos);
        // setSubscriptionsVideos(response.data.data.flatMap((item) => item.videos));
      } catch (error) {
        console.log("subscriptions of headers: " + JSON.stringify(error.message));
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <>
      {sidebar ? (
        <div
          style={{
            marginLeft: 240,
            paddingTop: 56,
            background: "rgb(0, 0, 0)",
            flexWrap: "wrap",
          }}
        >
          <aside
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              padding: 5,
              alignItems: "flex-end",
              flexWrap: "wrap",
              background: "rgb(0, 0, 0)",
              display: "flex",
              gap: 15,
            }}
          >
            {subscriptionsVideos &&
              subscriptionsVideos.map((video, i) => (
                <div
                  key={i}
                  style={{
                    width: "30%",
                    margin: "10px",
                    boxShadow: "inherit",
                  }}
                >
                  <Link to={`/watch/${video._id}`}>
                    {/* Thumbnail */}
                    <img
                      src={video?.thumbnail || "images/1.png"}
                      style={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: " 10px",
                      }}
                      alt=""
                    />
                  </Link>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      padding: 1,
                      alignItems: "flex-start",
                      marginTop: 6,
                    }}
                  >
                    <div>
                      {/* Owner Details */}
                      <Link to={`/${video?.owner?.username}`}>
                        <img
                          src={video?.owner?.avatar}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingLeft: 3,
                        alignItems: "flex-start",
                        color: "white",
                      }}
                    >
                      <Link
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          top: 0,
                          textDecoration: "none",
                          color: "white",
                        }}
                        to="/"
                      >
                        {video?.title || video?.tittle}
                      </Link>
                      <Link
                        style={{
                          fontSize: 16,
                          color: "#AAAAAA",
                          fontWeight: "400",
                          marginTop: 5,
                          textDecoration: "none",
                        }}
                        to="/"
                      >
                        {video?.owner?.fullName}
                      </Link>
                      <Link
                        style={{
                          marginTop: 0,
                          fontSize: 16,
                          color: "#AAAAAA",
                          fontWeight: "400",
                          gap: 8,
                          textDecoration: "none",
                        }}
                        to="/"
                      >
                        {video.views}{" "}
                        {video.views === 0 || 1 ? "view" : "views"}
                        {"  | "}
                        <span>
                          {formatDistanceToNow(new Date(video.createdAt))} ago
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            <hr />
          </aside>
        </div>
      ) : (
        <div
          style={{
            marginLeft: 80,
            paddingTop: 56,
            background: "rgb(0, 0, 0)",
            flexWrap: "wrap",
          }}
        >
          <aside
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              padding: 5,
              alignItems: "flex-end",
              flexWrap: "wrap",
              background: "#rgb(0, 0, 0)",
            }}
          >
            {subscriptionsVideos &&
              subscriptionsVideos.map((video, i) => (
                // {subscriptionsVideos && subscriptionsVideos.videos && subscriptionsVideos.videos.map((video, i) => (

                <div
                  key={i}
                  style={{
                    width: "23%",
                    margin: "10px",
                    boxShadow: "inherit",
                  }}
                >
                  <Link to={`/watch/${video._id}`}>
                    {/* Thumbnail */}
                    <img
                      src={video.thumbnail || "images/1.png"}
                      style={{
                        width: "100%",
                        height: 190,
                        borderRadius: " 10px",
                      }}
                      alt=""
                    />
                  </Link>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      padding: 1,
                      alignItems: "flex-start",
                      marginTop: 6,
                    }}
                  >
                    <div>
                      {/* Owner Details */}
                      <Link to={`/${video?.owner?.username}`}>
                        <img
                          src={video?.owner?.avatar}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingLeft: 3,
                        alignItems: "flex-start",
                        color: "white",
                      }}
                    >
                      <Link
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          top: 0,
                          textDecoration: "none",
                          color: "white",
                        }}
                        to="/"
                      >
                        {video?.title || video?.tittle}
                      </Link>
                      <Link
                        style={{
                          fontSize: 16,
                          color: "#AAAAAA",
                          fontWeight: "400",
                          marginTop: 5,
                          textDecoration: "none",
                        }}
                        to="/"
                      >
                        {video?.owner?.fullName}
                      </Link>
                      <Link
                        style={{
                          marginTop: 0,
                          fontSize: 16,
                          color: "#AAAAAA",
                          fontWeight: "400",
                          gap: 8,
                          textDecoration: "none",
                        }}
                        to="/"
                      >
                        {video?.views}{" "}
                        {video?.views === 0 || 1 ? "view" : "views"}
                        {"  | "}
                        <span>
                          {formatDistanceToNow(new Date(video.createdAt))} ago
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            <hr />
          </aside>
        </div>
      )}
    </>
  );
};

export default Subscriptions;
