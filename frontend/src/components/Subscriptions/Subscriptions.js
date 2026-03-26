import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import PageIntro from "../shared/PageIntro";
import VideoCard from "../shared/VideoCard";
import EmptyState from "../shared/EmptyState";
import { API_V1_URL } from "../../config/api";

const Subscriptions = () => {
  const [subscriptionsVideos, setSubscriptionsVideos] = useState([]);
  const { userProfile } = useContext(UserContext);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken || !userProfile?._id) {
          setSubscriptionsVideos([]);
          return;
        }

        const response = await axios.get(
          `${API_V1_URL}/subscriptions/u/${userProfile._id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const allVideos = (response.data.data || []).flatMap((item) => item.videos || []);
        const sortedVideos = allVideos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSubscriptionsVideos(sortedVideos);
      } catch (error) {
        console.log("subscriptions of headers: " + JSON.stringify(error.message));
      }
    };

    fetchSubscriptions();
  }, [userProfile?._id]);

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Following"
        title="Latest from your subscriptions"
        description="A streamlined feed of the newest uploads from channels you follow."
      />

      {subscriptionsVideos.length ? (
        <section className="video-grid">
          {subscriptionsVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No subscription videos yet"
          description="Subscribe to more channels to fill this space with fresh uploads."
        />
      )}
    </div>
  );
};

export default Subscriptions;
