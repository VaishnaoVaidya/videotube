import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import PageIntro from "../shared/PageIntro";
import VideoCard from "../shared/VideoCard";
import EmptyState from "../shared/EmptyState";
import { API_V1_URL } from "../../config/api";

const LikedVideos = () => {
  const host = API_V1_URL;
  const [likedVideos, setLikedVideos] = useState([]);
  const { userProfile } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfile || !userProfile._id) {
          return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${host}/likes/likedVideos/${userProfile._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const likedResponseWithVideo = response.data.data || [];
        const videosWithVideo = likedResponseWithVideo.filter((item) => item.video);
        setLikedVideos(videosWithVideo.map((item) => item.video));
      } catch (error) {
        console.error("Failed to fetch liked videos:", error.message);
      }
    };

    fetchData();
  }, [userProfile]);

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Library"
        title="Liked videos"
        description="Everything you liked, collected into a calmer browsing surface."
      />

      {likedVideos.length ? (
        <section className="video-grid">
          {likedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No liked videos yet"
          description="Tap the like button on any video and it will show up here."
        />
      )}
    </div>
  );
};

export default LikedVideos;
