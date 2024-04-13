import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {formatDistanceToNow} from 'date-fns';
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import "../../css/Component.css"

const LikedVideos = () => {
  const host = "http://localhost:8000/api/v1";
  const [likedVideos, setLikedVideos] = useState([]);
  const { sidebar } = useContext(UserContext);
  const {accessToken} = useContext(UserContext)
  const { userProfile } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [hoveredStates, setHoveredStates] = useState([]);

  const handleMouseEnter = (index) => {
    // Set the hovered state of the video at the specified index to true
    setHoveredStates((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleMouseLeave = (index) => {
    // Set the hovered state of the video at the specified index to false
    setHoveredStates((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfile || !userProfile._id) {
          console.error('User profile or _id is missing');
          return; // Exit early if userProfile or _id is missing
        }
  
        // const userId = userProfile._id;
        // console.log("userId: " + userId);
        const accessToken = localStorage.getItem('accessToken');
        // const response = await axios.get(`${host}/likes/likedVideos/${userId}`, {
        const response = await axios.get(`http://localhost:8000/api/v1/likes/likedVideos/65c51c6ca01af72d69a60263`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        console.log('Response Data Type:', response.data.data);
        const likedResponseWithVideo = response.data.data
        const videosWithVideo = likedResponseWithVideo.filter(item => item.video !== undefined);
const videoProperties = videosWithVideo.map(item => item.video);
setLikedVideos(videoProperties);

       
      } catch (error) {
        console.error('Failed to fetch liked videos:', error.message);
      }
    };
  
    fetchData();
  }, [userProfile]); // Trigger effect when userProfile changes
  
  
  return (
    <>
      {sidebar ? (
        <div style={{ marginLeft: 240, paddingTop: 56, background: "rgb(0, 0, 0)", flexWrap: "wrap" }}>
          <aside style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row", padding: 5, alignItems: "flex-end", flexWrap: "wrap", background: "rgb(0, 0, 0)", display: "flex", gap: 15 }}>
            {likedVideos.map((video, i) => (
              <div key={i} style={{ width: "30%", margin: "10px", boxShadow: "inherit" }}>
                <Link to={`/watch/${video._id}`}>
                  <div
                   onMouseEnter={() => handleMouseEnter(i)}
                   onMouseLeave={() => handleMouseLeave(i)}
                    style={{ position: "relative", width: "100%", height: 220 }}
                  >
                    {hoveredStates[i] ? (
                      <div>
                        <video
                          src={video.videoFile}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                          autoPlay
                          muted
                          controls
                        />
                      </div>
                    ) : (
                      <img
                        src={video.thumbnail || "images/1.png"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                        alt=""
                      />
                    )}
                  </div>
                </Link>
                {/* Owner Details */}
                <div style={{ display: "flex", justifyContent: "flex-start", padding: 1, alignItems: "flex-start", marginTop: 6 }}>
                  <Link to={`/${video?.owner?.username}`}>
                    <img src={video.owner.avatar} style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }} alt="" />
                  </Link>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 3, alignItems: "flex-start", color: "white" }}>
                    <Link style={{ fontSize: 16, fontWeight: "500", top: 0, textDecoration: "none", color: "white" }} to="/">
                      {video?.title || video?.tittle}
                    </Link>
                    <Link style={{ fontSize: 16, color: "#AAAAAA", fontWeight: "400", marginTop: 5, textDecoration: "none" }} to="/">
                      {video.owner.fullName}
                    </Link>
                    <Link style={{ marginTop: 0, fontSize: 16, color: "#AAAAAA", fontWeight: "400", gap: 8, textDecoration: "none" }} to="/">
                      {video.views} {video.views === 0 || 1 ? "view" : "views"}{"  | "}
                      <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <hr />
          </aside>
        </div>
      ) : (
        <div style={{ marginLeft: 80, paddingTop: 56, background: "rgb(0, 0, 0)", flexWrap: "wrap" }}>
          <aside style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row", padding: 5, alignItems: "flex-end", flexWrap: "wrap", background: "rgb(0, 0, 0)" }}>
            {likedVideos.map((video, i) => (
              <div key={i} style={{ width: "23%", margin: "10px", boxShadow: "inherit" }}>
                
                <Link to={`/watch/${video._id}`}>
                  <div
                   onMouseEnter={() => handleMouseEnter(i)}
                   onMouseLeave={() => handleMouseLeave(i)}
                    style={{ position: "relative", width: "100%", height: 220 }}
                  >
                    {hoveredStates[i] ? (
                      <div>
                        <video
                          src={video.videoFile}
                          style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: "10px" }}
                          autoPlay
                          muted
                          controls
                        />
                      </div>
                    ) : (
                      <img
                        src={video.thumbnail || "images/1.png"}
                        style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: "10px" }}
                        alt=""
                      />
                    )}
                  </div>
                </Link>
                {/* Owner Details */}
                <div style={{ display: "flex", justifyContent: "flex-start", padding: 1, alignItems: "flex-start", marginTop: 6 }}>
                  <Link to={`/${video?.owner?.username}`}>
                    <img src={video?.owner?.avatar} style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }} alt="" />
                  </Link>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 3, alignItems: "flex-start", color: "white" }}>
                    <Link style={{ fontSize: 16, fontWeight: "500", top: 0, textDecoration: "none", color: "white" }} to="/">
                      {video?.title || video?.tittle}
                    </Link>
                    <Link style={{ fontSize: 16, color: "#AAAAAA", fontWeight: "400", marginTop: 5, textDecoration: "none" }} to="/">
                      {video?.owner?.fullName}
                    </Link>
                    <Link style={{ marginTop: 0, fontSize: 16, color: "#AAAAAA", fontWeight: "400", gap: 8, textDecoration: "none" }} to="/">
                      {video.views} {video.views === 0 || 1 ? "view" : "views"}{"  | "}
                      <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
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
  )
}

export default LikedVideos
