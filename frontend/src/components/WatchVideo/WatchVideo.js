import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { PiShareFat } from "react-icons/pi";
import { MdPlaylistAdd } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Comments from "../Comments/Comments";

const WatchvideoDetails = () => {
  const { videoId } = useParams();
  const host = "http://localhost:8000/api/v1";
  console.log("searchId: " + videoId);
  const [videoDetails, setVideoDetails] = useState({});
  const { sidebar } = useContext(UserContext);
  const { userProfile } = useContext(UserContext);
  const userId = userProfile._id;

  const [videos, setVideos] = useState([]);
  const [videoLikeStatus, setVideoLikeStatus] = useState(undefined);
  const [videoLikesCount, setVideoLikesCount] = useState();
  const [videoDislike, setVideoDislike] = useState([]);
  const [like, setLike] = useState({});
  const [dislike, setDislike] = useState({});

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
        // console.log('Response Data Type:', response.data.data);

        // Check the type of response data
        if (response.data && Array.isArray(response.data.data)) {
          setVideos(response.data.data);
          console.log("Home", response.data.data);
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);
  // const {url} = useParams()
  // const videoDetailsId = extractvideoDetailsId(url)
  // console.log("searchId: " + videoDetailsId);

  // function extractvideoDetailsId(url) {
  //     const match = url.match(/[?&]v=({[^&]+)/)
  //     return match ? match[1] : null
  // }

  useEffect(() => {

    const accessToken = window.localStorage.getItem("accessToken");
    console.log(
      accessToken,
      "\n",
      "accessToken: ",
      window.localStorage.getItem("accessToken")
    );
    const fetchvideoDetails = async () => {
      try {
        const response = await axios.get(`${host}/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const likesResponse = await axios.get(`${host}/likes/video/${videoId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const hasLiked = likesResponse.data.data.some((like) => like.likedBy === userId)
          setVideoLikeStatus(hasLiked);

        // setVideoLikesCount(likeCount);

        console.log("Watch videoDetails: ", response.data.data);
        console.log("likesResponse:" + JSON.stringify(likesResponse.data));
        setVideoDetails(response.data.data);
      } catch (error) {
        console.log("Watch videoDetails", error.message);
      }
    };
    fetchvideoDetails();
  }, [videoId,]); // Add videoDetailsId as a dependency to re-run the effect when the videoDetailsId changes

  // Correct
useEffect(() => {
  console.log('Component rendered with videoLikeStatus:', videoLikeStatus);
}, [videoLikeStatus]);

  const handleToggleLike = async () => {
    const { _id: videoId } = videoDetails;
    const userId = userProfile._id;
    const accessToken = localStorage.getItem("accessToken");

    try {
      // Send the like/dislike status to the server
      const response = await axios.post(
        `${host}/likes/toggle/vl/${videoId}`,
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

      const { liked, likeCount } = response.data;
      // Update state with new like status and count
      console.log('Before State Update:', videoLikeStatus);

      setVideoLikeStatus((prevLiked) => !prevLiked);
          
      console.log('After State Update:', videoLikeStatus);

        setVideoLikesCount(likeCount);
      
      console.log("Video likes:", response.data);
    } catch (error) {
      console.log("Toggle Video Like error", error.message);
    }
  };



  const handleToggleDislike= async () => {
    
  }

  return (
    <>
      {!sidebar ? (
        <div
          style={{
            marginInline: 110,
            paddingTop: 56,
            background: "rgb(15, 15, 15)",
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
              background: "rgb(15, 15, 15)",
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
                  style={{
                    width: "100%",
                    height: "80vh",
                    borderRadius: 15,
                    position: "static",
                  }}
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
                          {" K"} subscribers
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
                        <button
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
                        </button>
                        <button
                          style={{
                            border: "1px solid #999",
                            background: "#000",
                            cursor: "pointer",
                            paddingInline: 4,
                            paddingBlock: 10,
                            width: 100,
                            height: 36,
                            backgroundColor: "white",
                            color: "black",
                            borderRadius: 25,
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buttons functionality */}
                  <div style={{ display: "flex", gap: 15, marginTop: -12 }}>
                    <div>
                      <button
                       onClick={() => handleToggleLike(videoDetails)}
                        style={{
                          border: "1px solid #999",
                          background: "#272727",
                          display: "inline-flex",
                          paddingTop: 8,
                          gap: 5,
                          textAlign: "center",
                          cursor: "pointer",

                          width: 70,
                          height: 35,
                          color: "white",
                          borderTopLeftRadius: 25,
                          borderBottomLeftRadius: 25,
                          fontSize: 14,
                          fontWeight: "600",
                        }}
                      >
                        { console.log("videoLikeStatus:" + videoLikeStatus) &&
                        videoLikeStatus === true ? (
                          <>
                            <BiSolidLike style={{ paddingLeft: 5 }} size={20} />
                            22k
                          </>
                        ) : (
                          <>
                            <BiLike style={{ paddingLeft: 5 }} size={20} />
                            22k
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
                        {videoDislike === true ? (
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
                  }}
                ></div>
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
              background: "rgb(15, 15, 15)",
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

export default WatchvideoDetails;
