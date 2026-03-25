import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import EmptyState from "../shared/EmptyState";

const RandomuserData = () => {
  const host = "http://localhost:8000/api/v1";
  const [userData, setUserData] = useState({});
  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : {};
        const response = await axios.get(`${host}/users/channel/${username}`, config);

        if (response.data.success) {
          setUserData(response.data.data[0] || {});
        }
      } catch (error) {
        console.log(error.message, "error getting RandomuserData access token");
      }
    };
    fetchUser();
  }, [username]);

  return (
    <div className="page-shell page-shell--full">
      {userData?._id ? (
        <>
          <section className="channel-hero">
            <img
              className="channel-hero__cover"
              src={userData?.coverImage || "images/cover.jpg"}
              alt={userData.fullName}
            />
            <div className="channel-hero__body">
              <img
                className="channel-hero__avatar"
                src={userData?.avatar || "images/unknown.png"}
                alt={userData.fullName}
              />
              <div className="channel-hero__meta">
                <h1 style={{ margin: 0 }}>{userData.fullName}</h1>
                <p style={{ margin: 0, color: "#94a3b8" }}>
                  @{userData.username} | {userData.subscribersCount || 0} subscribers |{" "}
                  {userData.totalVideos || 0} videos
                </p>
                <p style={{ margin: 0, color: "#cbd5e1" }}>
                  {userData.bio || "Channel profile refreshed with the same visual language as the rest of VideoTube."}
                </p>
                <div className="channel-stat-list">
                  <span className="stat-chip">{userData.totalVideos || 0} uploads</span>
                  <span className="stat-chip">{userData.subscribersCount || 0} subscribers</span>
                  <span className="stat-chip">Public channel</span>
                </div>
              </div>
            </div>
          </section>

          <div className="channel-tabs">
            <Link className="channel-tab is-active" to={`/${username}`}>
              Home
            </Link>
            <Link className="channel-tab" to={`/channel/${username}/playlists`}>
              Videos
            </Link>
            <Link className="channel-tab" to={`/channel/${username}/playlists`}>
              Playlists
            </Link>
          </div>
        </>
      ) : (
        <EmptyState
          title="Channel not found"
          description="We could not load this creator right now."
        />
      )}
    </div>
  );
};

export default RandomuserData;
