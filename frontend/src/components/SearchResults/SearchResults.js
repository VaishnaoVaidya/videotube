import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PageIntro from "../shared/PageIntro";
import VideoCard from "../shared/VideoCard";
import EmptyState from "../shared/EmptyState";

const SearchResults = () => {
  const host = "https://videotube-backend-5fg2.onrender.com/api/v1";
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const config = accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : {};

        const response = await axios.get(`${host}/videos/allvideos`, config);
        setVideos(response.data?.data || []);
      } catch (error) {
        console.error(error.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return videos.filter((video) => {
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

      return haystack.includes(normalizedQuery);
    });
  }, [query, videos]);

  if (loading) {
    return (
      <div className="page-shell">
        <PageIntro
          eyebrow="Search"
          title="Loading search results"
          description="Finding videos and creators that match your query."
        />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Search"
        title={query ? `Results for "${query}"` : "Search videos and creators"}
        description="Search now scans public video titles, descriptions, and creator names so the top bar feels like a real YouTube-style discovery tool."
      />

      {query ? (
        filteredVideos.length ? (
          <section className="search-results-list">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} variant="list" showPreview={false} />
            ))}
          </section>
        ) : (
          <EmptyState
            title="No matching videos found"
            description="Try a different keyword, creator name, or topic phrase from the search bar."
          />
        )
      ) : (
        <EmptyState
          title="Start with a search"
          description="Type a video title, creator name, or keyword in the top bar to see matching results."
        />
      )}
    </div>
  );
};

export default SearchResults;
