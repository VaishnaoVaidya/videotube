import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {formatDistanceToNow} from 'date-fns';
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";


const DEBOUNCE_DELAY = 500; // Adjust the debounce delay as needed

const WatchedHistory = () => {
  const host = "http://localhost:8000/api/v1";
  const [watchedHistoryVideos, setWatchedHistoryVideos] = useState([]);
  const {accessToken} = useContext(UserContext)
  const {sidebar} = useContext(UserContext)

  const [hoveredStates, setHoveredStates] = useState([]);

  const [debouncedFetchData, setDebouncedFetchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${host}/users/history`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("watch history response:", response.data.data);
        setWatchedHistoryVideos(response.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Debounce fetchData function
    const debouncedFn = setTimeout(() => {
      setDebouncedFetchData(() => fetchData);
    }, DEBOUNCE_DELAY);

    // Clear the timeout on unmount or when dependencies change
    return () => clearTimeout(debouncedFn);
  }, [accessToken]);

  useEffect(() => {
    // Execute debounced fetchData function
    if (debouncedFetchData) {
      debouncedFetchData();
    }
  }, [debouncedFetchData]);


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
  
  return (
    <>
    {sidebar ? (
      <div style={{ marginLeft: 240, paddingTop: 56, background: "rgb(0, 0, 0)", flexWrap: "wrap" }}>
        <aside style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row", padding: 5, alignItems: "flex-end", flexWrap: "wrap", background: "rgb(0, 0, 0)", display: "flex", gap: 15 }}>
          {watchedHistoryVideos.map((video, i) => (
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
          {watchedHistoryVideos.map((video, i) => (
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
    )}
  </>
  )
}

export default WatchedHistory
