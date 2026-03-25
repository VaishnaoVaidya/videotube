import axios from "axios";
import React, { useEffect, useState } from "react";
import PageIntro from "../shared/PageIntro";
import VideoCard from "../shared/VideoCard";
import EmptyState from "../shared/EmptyState";

const DEBOUNCE_DELAY = 500;

const WatchedHistory = () => {
  const host = "http://localhost:8000/api/v1";
  const [watchedHistoryVideos, setWatchedHistoryVideos] = useState([]);
  const [debouncedFetchData, setDebouncedFetchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/users/history`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setWatchedHistoryVideos(response.data.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };

    const debouncedFn = setTimeout(() => {
      setDebouncedFetchData(() => fetchData);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debouncedFn);
  }, []);

  useEffect(() => {
    if (debouncedFetchData) {
      debouncedFetchData();
    }
  }, [debouncedFetchData]);

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="History"
        title="Keep watching where you left off"
        description="Revisit recent videos with a cleaner, more readable history view."
      />

      {watchedHistoryVideos.length ? (
        <section className="video-grid">
          {watchedHistoryVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Your watch history is empty"
          description="Start watching videos and we will build your history automatically."
        />
      )}
    </div>
  );
};

export default WatchedHistory;
