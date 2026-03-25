import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageIntro from "../shared/PageIntro";
import VideoCard from "../shared/VideoCard";
import EmptyState from "../shared/EmptyState";

const topicMatchers = {
  music: ["music", "song", "mix", "beat", "audio"],
  gaming: ["game", "gaming", "play", "stream", "esports"],
  podcasts: ["podcast", "talk", "interview", "conversation"],
  react: ["react", "javascript", "frontend", "web", "coding"],
  live: ["live", "stream", "broadcast"],
  news: ["news", "update", "breaking", "today"],
  mix: ["mix", "playlist", "compilation"],
  recent: [],
};

const matchesTopic = (video, topic) => {
  if (!topic || topic === "all") {
    return true;
  }

  if (topic === "recent") {
    return true;
  }

  const haystack = [
    video?.title,
    video?.tittle,
    video?.description,
    video?.owner?.fullName,
    video?.owner?.username,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (topicMatchers[topic] || [topic]).some((word) => haystack.includes(word));
};

const Home = () => {
  const host = "https://videotube-backend-5fg2.onrender.com/api/v1";
  const location = useLocation();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : {};
        const response = await axios.get(`${host}/videos/allvideos`, config);

        if (response.data && Array.isArray(response.data.data)) {
          setVideos(response.data.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const topic = new URLSearchParams(location.search).get("topic") || "all";

  const filteredVideos = useMemo(() => {
    const nextVideos = videos.filter((video) => matchesTopic(video, topic));

    if (topic === "recent") {
      return [...nextVideos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return nextVideos;
  }, [videos, topic]);

  const featuredVideo = filteredVideos[0];
  const recommendedVideos = filteredVideos.slice(1);
  const sidebarVideos = filteredVideos.slice(1, 5);
  const creatorSpotlight = filteredVideos.slice(0, 4);

  return (
    <div className="page-shell page-shell--full">
      <PageIntro
        eyebrow="Trending now"
        title="A YouTube-style home feed with stronger discovery"
        description="Browse by topic, jump into featured content, and scan fresh uploads in a layout that feels closer to a modern video platform."
      />

      {featuredVideo ? (
        <section className="home-feature">
          <Link className="home-feature__hero" to={`/watch/${featuredVideo._id}`}>
            <img
              src={featuredVideo.thumbnail || "images/1.png"}
              alt={featuredVideo.title || featuredVideo.tittle}
            />
            <div className="home-feature__overlay">
              <span className="home-feature__eyebrow">Featured for you</span>
              <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 3vw, 3rem)" }}>
                {featuredVideo.title || featuredVideo.tittle}
              </h2>
              <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 720 }}>
                {featuredVideo.description || "Jump into one of the most visible videos in your feed right now."}
              </p>
              <div className="home-feature__stats">
                <span className="stat-chip">{featuredVideo.views || 0} views</span>
                <span className="stat-chip">@{featuredVideo?.owner?.username || "creator"}</span>
                <span className="stat-chip">{topic === "all" ? "For you" : topic}</span>
              </div>
            </div>
          </Link>

          <div className="video-row">
            {sidebarVideos.map((video) => (
              <VideoCard key={video._id} video={video} variant="list" showPreview={false} />
            ))}
          </div>
        </section>
      ) : null}

      {filteredVideos.length ? (
        <>
          <section className="home-section">
            <div className="home-section__header">
              <div>
                <h2>Recommended</h2>
                <p style={{ color: "#94a3b8" }}>
                  Videos tuned to the current topic and ready to explore.
                </p>
              </div>
            </div>
            <section className="video-grid">
              {(recommendedVideos.length ? recommendedVideos : filteredVideos).map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </section>
          </section>

          <section className="home-section">
            <div className="home-section__header">
              <div>
                <h2>Creator spotlight</h2>
                <p style={{ color: "#94a3b8" }}>
                  Quick access to channels behind the videos in this feed.
                </p>
              </div>
            </div>
            <div className="video-row">
              {creatorSpotlight.map((video) => (
                <VideoCard key={`spotlight-${video._id}`} video={video} variant="list" showPreview={false} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          title="No videos are available for this topic"
          description="Try another topic chip or upload more content to fill the feed."
        />
      )}
    </div>
  );
};

export default Home;
