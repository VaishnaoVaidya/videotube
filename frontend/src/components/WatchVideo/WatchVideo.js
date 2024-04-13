import axios from "axios";
import React, { useMemo, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { formatDistanceToNow, sub } from "date-fns";
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { PiShareFat } from "react-icons/pi";
import { MdNotificationsActive, MdPlaylistAdd } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Comments from "../Comments/Comments";

const WatchVideoDetails = () => {
  // const forceUpdate = useForceUpdate(); // Assuming you have a custom hook for forceUpdate

  const { videoId } = useParams();
  const host = "http://localhost:8000/api/v1";
  // console.log("searchId: " + videoId);
  const [videoDetails, setVideoDetails] = useState({});
  const [subscribe, setSubscribe] = useState(null);
  const [subscriberData, setSubscriberData] = useState([]);
  const { sidebar } = useContext(UserContext);
  const { userProfile } = useContext(UserContext);
  // console.log("userProfile._id "+ ": " + userProfile._id);
  const [videos, setVideos] = useState([]);
  const [videoLikeStatus, setVideoLikeStatus] = useState(null);
  const [videoLikesCount, setVideoLikesCount] = useState([]);
  const [videoDislikeStatus, setVideoDislikeStatus] = useState(null);

  const [likesArray, setLikesArray] = useState([]);

  const [views, setViews] = useState(videos.views);

  const trackView = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${host}/views/${videoId}`,

        { videoId: videoId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        console.log("response.data of views: ", response.data);
        setViews(response.data.views);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if there's a stored access token in localStorage
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/videos/allvideos`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!accessToken) {
          alert("please login or signUp to grant access");
        }
        // // console.log('Response Data Type:', response.data.data);

        // Check the type of response data
        if (response.data && Array.isArray(response.data.data)) {
          setVideos(response.data.data);
          // console.log("Home", response.data.data);
        } else {
          // console.error("Invalid data format received");
        }
      } catch (error) {
        // console.error(error.message);
      }
    };
    fetchData();
  }, []);
  // const {url} = useParams()
  // const videoDetailsId = extractvideoDetailsId(url)
  // // console.log("searchId: " + videoDetailsId);

  // function extractvideoDetailsId(url) {
  //     const match = url.match(/[?&]v=({[^&]+)/)
  //     return match ? match[1] : null
  // }

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        const subscriberId = userProfile._id;
        const response = await axios.get(`${host}/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const likesResponse = await axios.get(
          `${host}/likes/video/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const userId = userProfile._id;
        const hasLiked = await likesResponse.data.data.some(
          (like) => like.likedBy === userId
        );
        const hasDisliked = await likesResponse.data.data.some(
          (like) => like.dislikedBy === userId
        );
        const likeDislikeArray = likesResponse.data.data;
        const likesCount = likeDislikeArray.filter(
          (like) => like.likedBy
        ).length;
        console.log("watchVideo", response.data.data);
        // Update the state after fetching the required data
        setVideoLikeStatus(hasLiked);
        setVideoDislikeStatus(hasDisliked);
        setVideoLikesCount(likesCount);
        setVideoDetails(response.data.data);

        setLikesArray(likeDislikeArray);

        try {
          const subscribeResponse = await axios.get(
            `${host}/subscriptions/c/${videoDetails.owner._id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("subscribeResponse:", subscribeResponse?.data.data);
          if (subscribeResponse?.data.data) {
              console.log("Channel 1:", subscribeResponse.data.data[0]?.channel._id);
              console.log("Channel 2:", subscribeResponse.data.data[1]?.channel._id);
          } else {
              console.error("Error: Invalid subscribeResponse or missing data.");
          }
         // Assuming setSubscriberData updates the state with subscribeResponse.data
setSubscriberData(subscribeResponse.data.data);

// Now, wait for the state to update and then perform your find operation
console.log("subscriberData: ", subscribeResponse.data.data); // Logging the updated data
if (typeof subscribeResponse.data === 'object' && subscribeResponse.data !== null) {
  // Assuming subscriber data is nested under some property, adjust accordingly
  const subscriberData = subscribeResponse.data.data;
  
  // Check if subscriberData is an array before attempting to find a subscriber
  if (Array.isArray(subscriberData)) {
      const foundSubscriber = subscriberData.find((subscriber) => {
          return subscriber.subscriber._id === userProfile._id;
      });
      
      if (foundSubscriber) {
        setSubscribe(true)
          console.log("Subscriber found:", foundSubscriber);
          // Do something with foundSubscriber
      } else {
          console.log("Subscriber not found.");
          // Handle case when subscriber is not found
      }
  } else {
      console.error("Subscriber data is not an array.");
      // Handle case when subscriber data is not an array
  }
} else {
  console.error("Invalid subscription data.");
  // Handle case when subscription data is not in the expected format
}

        } catch (error) {
          console.error("Error fetching subscription data:", error);
        }

        // // console.log("Video details fetched:", response.data.data);
        // // console.log("Likes fetched:", likesResponse.data.data);
        // // console.log("User profile ID:", userId);
        // // console.log("Has liked:", hasLiked);
        // // console.log("Likes count:", likesCount);
      } catch (error) {
        console.log("Error fetching video details", error.message);
      }
    };

    fetchVideoDetails();
  }, [
    videoId,
    userProfile,
    videoLikeStatus,
    videoLikesCount,
    videoDislikeStatus,
  ]);

  // Correct
  useEffect(() => {
    // console.log('Component rendered with videoLikeStatus:', videoLikeStatus);
  }, [videoLikeStatus]);

  const memoizedLikesCount = useMemo(() => videoLikesCount, [videoLikesCount]);

  const handleToggleLike = async () => {
    const { _id: videoId } = videoDetails;
    const userId = userProfile._id;
    // console.log("handleToggleLike userId: " + userId);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // Send the like/dislike status to the server
      const response = await axios.post(
        `${host}/likes/toggle/video/${videoId}`,
        {
          likedBy: userId,
          dislikedBy: null, // Reset dislike when liking
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { liked, likeCount } = response.data.data;

      // Update state with new like status and count
      setVideoLikeStatus(liked);
      setVideoLikesCount(likeCount);
      // setVideoLikesCount((prevCount) => prevCount + 1);

      // console.log("video like response: ",response.data);
      // console.log("Video liked:", response.data.data.liked);
      // // console.log("Video likes count:", response.data.data.likeCount);
    } catch (error) {
      // console.log("Toggle Video Like error", error.message);
    }
  };

  const addToWatchHistory = async (videoId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      // Send a POST request to your backend API to add the video to the watch history
      const response = await axios.post(
        `${host}/users/addWatchHistory/${videoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log('Video added to watch history', response.data);
    } catch (error) {
      console.error('Error adding video to watch history:', error);
    }
  };
  

  const handleSubscribeChannel = async () => {
    const {
      owner: { _id: channelId },
    } = videoDetails;

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `${host}/subscriptions/c/${channelId}`,
        null, // Passing null or an empty object as the second argument because you're not sending any data in the request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("subscribing channel", response.data.data);

      setSubscribe(response.data.data.isSubscribed);
      // setVideoLikesCount((prevCount) => Math.max(0, prevCount - 1));

      // console.log("video dislike response: ",response.data);
      // console.log("Video disliked:", response.data.data.liked);
      // // console.log("Video disliked count:", response.data.data.likeCount);
    } catch (error) {
      console.log("Toggle Subscription Like error", error.message);
      console.log("channel Id:", channelId);
    }
  };

  const handleToggleDislike = async () => {
    const { _id: videoId } = videoDetails;
    const userId = userProfile._id;
    // console.log("handleToggleLike userId: " + userId);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // Send the like/dislike status to the server
      const response = await axios.post(
        `${host}/likes/toggle/video/${videoId}`,
        {
          dislikedBy: userId,
          likedBy: null, // Reset dislike when liking
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { disliked, likeCount } = response.data.data;

      setVideoDislikeStatus(disliked);
      // setVideoLikesCount((prevCount) => Math.max(0, prevCount - 1));

      // console.log("video dislike response: ",response.data);
      // console.log("Video disliked:", response.data.data.liked);
      // // console.log("Video disliked count:", response.data.data.likeCount);
    } catch (error) {
      // console.log("Toggle Video Like error", error.message);
    }
  };

  return (
    <>
      {!sidebar ? (
        <div
          style={{
            marginInline: 110,
            paddingTop: 56,
            background: "rgb(0, 0, 0)",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/* watch videoDetails */}
          <aside
            style={{
              display: "flex",
              width: "70%",
              justifyContent: "flex-start",
              margin: 5,
              background: "rgb(0, 0, 0)",
              gap: 15,
            }}
          >
            {videoDetails && (
              <div
                style={{
                  height: "auto",
                  margin: "10px",
                  display: "flex",
                  boxShadow: "inherit",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <video
                    onClick={() => addToWatchHistory(videoDetails._id)}       
                    style={{
                    width: "100%",
                    height: "80vh",
                    borderRadius: 15,
                    position: "static",
                  }}
                  onPlay={trackView}
                  src={videoDetails.videoFile}
                  controls
                ></video>

                {/* VIDEO TITTLE */}
                <div>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginTop: 2,
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    Conda and jupyter notebook in python
                    {videoDetails?.title || videoDetails?.tittle}
                  </p>
                </div>

                {/* VIDEO OWNER    */}

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    padding: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginTop: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: 0,
                      justifyContent: "center",
                      gap: 13,
                      alignItems: "flex-start",
                      color: "white",
                    }}
                  >
                    {/* Owner image */}

                    <Link to={`/${videoDetails?.owner?.username}`}>
                      <img
                        src={videoDetails.owner?.avatar}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          marginTop: -6,
                        }}
                        alt=""
                      />
                    </Link>

                    {/* owner channel details */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: -8,
                        alignItems: "flex-start",
                        color: "white",
                      }}
                    >
                      {/* owner name views */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          marginTop: -8,
                          paddingLeft: 3,
                          alignItems: "flex-start",
                          color: "white",
                        }}
                      >
                        <Link
                          style={{
                            fontSize: 18,
                            color: "#fff",
                            fontWeight: "500",
                            marginTop: 5,
                            textDecoration: "none",
                          }}
                          to="/"
                        >
                          {videoDetails?.owner?.fullName}
                        </Link>
                        <p
                          style={{
                            marginTop: 0,
                            fontSize: 12,
                            color: "#AAAAAA",
                            fontWeight: "400",
                            gap: 8,
                            textDecoration: "none",
                          }}
                        >
                          {subscriberData.length + " K"} subscribers
                        </p>
                      </div>

                      {/* channel subscribtion join */}
                      <div
                        style={{
                          display: "flex",
                          gap: 15,
                          marginLeft: 10,
                          alignItems: "center",
                        }}
                      >
                        {/* <button
                          style={{
                            border: "1px solid #999",
                            background: "#000",
                            cursor: "pointer",
                            cursor: "pointer",

                            paddingInline: 4,
                            paddingBlock: 10,
                            width: 60,
                            height: 36,
                            color: "white",
                            borderRadius: 25,
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          Join
                        </button> */}
                      
                      </div>
                    </div>
                  </div>

                  {/* Buttons functionality */}
                  <div style={{ display: "flex", gap: 15, marginTop: -5 }}>
                  <button
                          onClick={handleSubscribeChannel}
                          style={{
                            background:
                            subscribe === true ? "rgb(39, 39, 39)" : "#fff",
                            color: subscribe === true ? "#fff" : "#000",
                            border: "1px solid #999",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            gap: "5px",
                            width: "auto",
                            height: 35,
                            paddingInline: "10px",
                            paddingBlock: "10px",
                           
                            borderRadius: 25,
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                         { subscribe === true ? (
            <>
                <MdNotificationsActive />
                <span>subscribed</span>
            </>
        ):(         <span>subscribe</span>
)}

                        </button>
                    <div>
                      <button
                        onClick={() => handleToggleLike(videoDetails)}
                        style={{
                          border: "1px solid #999",
                          background: "#272727",
                          display: "inline-flex",
                          paddingTop: 8,
                          gap: 10,
                          textAlign: "center",
                          cursor: "pointer",
                          width: "auto",
                          height: 35,
                          color: "white",
                          paddingInline: 10,
                          borderTopLeftRadius: 25,
                          borderBottomLeftRadius: 25,
                          fontSize: 14,
                          fontWeight: "600",
                        }}
                      >
                        {videoLikeStatus ? (
                          <>
                            <BiSolidLike style={{ paddingLeft: 5 }} size={20} />
                            {videoLikesCount && videoLikesCount}
                          </>
                        ) : (
                          <>
                            <BiLike style={{ paddingLeft: 5 }} size={20} />
                            {videoLikesCount && videoLikesCount}
                          </>
                        )}
                      </button>
                      <span
                        style={{
                          height: 30,
                          width: 1,
                          border: "1px solid red",
                        }}
                      />
                      <button
                        onClick={() => handleToggleDislike(videoDetails)}
                        style={{
                          border: "1px solid #999",
                          cursor: "pointer",
                          background: "#272727",
                          display: "inline-flex",
                          paddingTop: 8,
                          gap: 5,
                          textAlign: "center",
                          width: 50,
                          height: 35,
                          color: "white",
                          borderTopRightRadius: 25,
                          borderBottomRightRadius: 25,
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        {videoDislikeStatus ? (
                          <BiSolidDislike
                            style={{ paddingLeft: 5 }}
                            size={20}
                          />
                        ) : (
                          <BiDislike style={{ paddingLeft: 5 }} size={20} />
                        )}
                      </button>
                    </div>

                    <button
                      style={{
                        border: "1px solid #999",
                        cursor: "pointer",
                        background: "#272727",
                        display: "inline-flex",
                        paddingTop: 8,
                        gap: 5,
                        textAlign: "center",
                        width: 85,
                        height: 35,
                        color: "white",
                        borderRadius: 25,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      <PiShareFat style={{ paddingLeft: 5 }} size={20} />
                      Share
                    </button>

                    <button
                      style={{
                        border: "1px solid #999",
                        cursor: "pointer",
                        background: "#272727",
                        display: "inline-flex",
                        paddingTop: 8,
                        gap: 5,
                        textAlign: "center",
                        width: 100,
                        height: 35,
                        color: "white",
                        borderRadius: 25,
                        fontSize: 14,
                        marginRight: 8,
                        fontWeight: "bold",
                      }}
                    >
                      <MdPlaylistAdd style={{ paddingLeft: 5 }} size={20} />
                      Playlists
                    </button>
                  </div>
                </div>

                {/* description */}
                <div
                  style={{
                    width: "100%",
                    height: 100,
                    borderRadius: 15,
                    background: "#272727",
                    color: "white",
                    gap: 5,
                    paddingLeft: 5,
                  }}
                >
                  <h4>
                    {videoDetails.views} views{" "}
                    <span>
                      {videoDetails.createdAt &&
                        formatDistanceToNow(new Date(videoDetails.createdAt)) +
                          " ago"}
                    </span>
                    <p>{videoDetails.description}</p>
                  </h4>{" "}
                </div>
                {/*  Comments on videos */}
                <Comments />
              </div>
            )}
          </aside>

          {/* /videos suggestion */}

          <aside
            style={{
              justifyContent: "flex-start",
              margin: 15,
              width: "30%",
              background: "rgb(0, 0, 0)",
              gap: 15,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 60,
                marginTop: 5,
                borderRadius: 15,
                background: "brown",
                color: "white",
              }}
            ></div>

            {/* suggest videos  */}
            <div
              style={{
                width: "100%",
                marginTop: 10,
              }}
            >
              {videos.map((video, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    marginTop: 5,
                    boxShadow: "inherit",
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                  }}
                >
                  <Link to={`/watch/${video._id}`}>
                    {/* Thumbnail */}
                    <img
                      src={video.thumbnail || "images/1.png"}
                      style={{
                        width: 170,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: " 10px",
                      }}
                      alt=""
                    />
                  </Link>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      padding: 1,
                      alignItems: "flex-start",
                      marginTop: 5,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingLeft: 10,
                        alignItems: "flex-start",
                        color: "white",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          marginTop: -10,
                          textDecoration: "none",
                          color: "white",
                        }}
                      >
                        {video?.title || video?.tittle}
                      </p>
                      <Link
                        style={{
                          fontSize: 12,
                          color: "#AAAAAA",
                          fontWeight: "400",
                          marginTop: -10,
                          textDecoration: "none",
                        }}
                        to="/"
                      >
                        {video.owner?.fullName}
                      </Link>
                      <Link
                        style={{
                          marginTop: 0,
                          fontSize: 12,
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
                          {/* {formatDistanceToNow(new Date(video?.createdAt))} ago */}
                        </span>
                      </Link>
                    </div>

                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        marginTop: -5,
                      }}
                    >
                      <HiOutlineDotsVertical />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default WatchVideoDetails;
