import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VideoCard from "../shared/VideoCard";
import EmptyState from "../shared/EmptyState";

const YourChannel = () => {
  const host = "http://localhost:8000/api/v1";
  const [channelData, setChannelData] = useState([]);
  const [channelVideos, setChannelVideos] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const fetchChannel = async () => {
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
        setChannelData(response.data.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchChannel();
  }, [username]);

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        const response = await axios.get(`${host}/videos/allvideos`);
        const nextVideos = (response.data.data || []).filter(
          (video) => video?.owner?.username === username
        );
        setChannelVideos(nextVideos);
      } catch (error) {
        console.log("Your Channel videos error: ", error.message);
      }
    };

    fetchChannelVideos();
  }, [username]);

  const channel = channelData[0];

  return (
    <div className="page-shell page-shell--full channel-layout">
      {channel ? (
        <section className="channel-hero">
          <img
            className="channel-hero__cover"
            src={channel?.coverImage || "images/cover.jpg"}
            alt={channel.fullName}
          />
          <div className="channel-hero__body">
            <img
              className="channel-hero__avatar"
              src={channel?.avatar || "images/unknown.png"}
              alt={channel.fullName}
            />
            <div className="channel-hero__meta">
              <h1 style={{ margin: 0 }}>{channel.fullName}</h1>
              <p style={{ margin: 0, color: "#94a3b8" }}>
                @{channel.username} | {channel.subscribersCount || 0} subscribers |{" "}
                {channel.totalVideos || 0} videos
              </p>
              <p style={{ margin: 0, color: "#cbd5e1" }}>
                {channel.bio || "A polished channel home ready for featured content, playlists, and uploads."}
              </p>
              <div className="channel-stat-list">
                <span className="stat-chip">{channel.totalVideos || 0} uploads</span>
                <span className="stat-chip">{channel.subscribersCount || 0} subscribers</span>
                <span className="stat-chip">Channel hub</span>
              </div>
            </div>
            <div className="channel-hero__actions">
              <Link className="secondary-button" to="/channel/upload">
                Upload
              </Link>
              <Link className="pill-button" to="/settings/profile">
                Customize channel
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <div className="channel-tabs">
        <Link className="channel-tab is-active" to={`/channel/${username}`}>
          Home
        </Link>
        <Link className="channel-tab" to={`/channel/${username}/playlists`}>
          Playlists
        </Link>
      </div>

      {channelVideos.length ? (
        <section className="video-grid">
          {channelVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No videos found"
          description="Upload your first video to turn this channel into a complete creator hub."
        />
      )}
    </div>
  );
};

export default YourChannel;
