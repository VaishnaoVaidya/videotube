import axios from "axios";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { PiShareFat } from "react-icons/pi";
import { MdNotificationsActive, MdPlaylistAdd } from "react-icons/md";
import Comments from "../Comments/Comments";
import UserContext from "../../context/UserContext";
import VideoCard from "../shared/VideoCard";
import { API_V1_URL } from "../../config/api";

const WatchVideoDetails = () => {
  const { videoId } = useParams();
  const host = API_V1_URL;
  const [videoDetails, setVideoDetails] = useState({});
  const [subscribe, setSubscribe] = useState(null);
  const [subscriberData, setSubscriberData] = useState([]);
  const { userProfile } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [videoLikeStatus, setVideoLikeStatus] = useState(null);
  const [videoLikesCount, setVideoLikesCount] = useState(0);
  const [videoDislikeStatus, setVideoDislikeStatus] = useState(null);
  const historyTrackedRef = useRef(false);

  const accessToken = localStorage.getItem("accessToken");

  const relatedVideos = useMemo(
    () => videos.filter((video) => video._id !== videoId).slice(0, 10),
    [videos, videoId]
  );

  const trackView = async () => {
    try {
      if (!accessToken) {
        return;
      }

      await axios.post(
        `${host}/views/${videoId}`,
        { videoId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    historyTrackedRef.current = false;
  }, [videoId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [accessToken]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const config = accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : {};
        const response = await axios.get(`${host}/videos/${videoId}`, config);

        const details = response.data.data;
        setVideoDetails(details);

        if (!accessToken) {
          setSubscriberData([]);
          setSubscribe(null);
          setVideoLikeStatus(null);
          setVideoDislikeStatus(null);
          setVideoLikesCount(0);
          return;
        }

        const likesResponse = await axios.get(`${host}/likes/video/${videoId}`, config);

        const likeDislikeArray = likesResponse.data.data || [];
        const userId = userProfile._id;
        const hasLiked = likeDislikeArray.some((like) => like.likedBy === userId);
        const hasDisliked = likeDislikeArray.some((like) => like.dislikedBy === userId);
        const likesCount = likeDislikeArray.filter((like) => like.likedBy).length;

        setVideoLikeStatus(hasLiked);
        setVideoDislikeStatus(hasDisliked);
        setVideoLikesCount(likesCount);

        if (details?.owner?._id) {
          const subscribeResponse = await axios.get(
            `${host}/subscriptions/c/${details.owner._id}`,
            config
          );

          const subscriptionEntries = subscribeResponse.data.data || [];
          setSubscriberData(subscriptionEntries);
          const foundSubscriber = subscriptionEntries.find(
            (subscriber) => subscriber.subscriber?._id === userProfile._id
          );
          setSubscribe(Boolean(foundSubscriber));
        }
      } catch (error) {
        console.log("Error fetching video details", error.message);
      }
    };

    fetchVideoDetails();
  }, [videoId, userProfile, accessToken]);

  const handleToggleLike = async () => {
    const currentVideoId = videoDetails?._id;
    const userId = userProfile._id;

    try {
      const response = await axios.post(
        `${host}/likes/toggle/video/${currentVideoId}`,
        { likedBy: userId, dislikedBy: null },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { liked, likeCount } = response.data.data;
      setVideoLikeStatus(liked);
      setVideoLikesCount(likeCount);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleToggleDislike = async () => {
    const currentVideoId = videoDetails?._id;
    const userId = userProfile._id;

    try {
      const response = await axios.post(
        `${host}/likes/toggle/video/${currentVideoId}`,
        { dislikedBy: userId, likedBy: null },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setVideoDislikeStatus(response.data.data.disliked);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubscribeChannel = async () => {
    const channelId = videoDetails?.owner?._id;

    if (!channelId) {
      return;
    }

    try {
      const response = await axios.post(`${host}/subscriptions/c/${channelId}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSubscribe(response.data.data.isSubscribed);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addToWatchHistory = async (currentVideoId) => {
    try {
      if (!accessToken) {
        return;
      }

      await axios.post(
        `${host}/users/addWatchHistory/${currentVideoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding video to watch history:", error);
    }
  };

  const handleVideoPlay = async () => {
    await trackView();

    if (!historyTrackedRef.current && videoDetails?._id) {
      historyTrackedRef.current = true;
      await addToWatchHistory(videoDetails._id);
    }
  };

  return (
    <div className="page-shell page-shell--full">
      <div className="watch-layout">
        <section style={{ display: "grid", gap: 20 }}>
          <div className="watch-player">
            <video
              onPlay={handleVideoPlay}
              src={videoDetails.videoFile}
              controls
            />
          </div>

          <div className="panel" style={{ display: "grid", gap: 18 }}>
            <h1 className="watch-title">
              {videoDetails?.title || videoDetails?.tittle || "Video details"}
            </h1>

            <div className="watch-meta-row">
              <div className="watch-owner">
                <Link to={`/${videoDetails?.owner?.username || ""}`}>
                  <img
                    src={videoDetails?.owner?.avatar || "images/unknown.png"}
                    alt={videoDetails?.owner?.fullName || "Owner"}
                  />
                </Link>
                <div className="watch-owner__meta">
                  <strong>{videoDetails?.owner?.fullName || "Creator"}</strong>
                  <span style={{ color: "#94a3b8" }}>
                    {subscriberData.length} subscriber{subscriberData.length === 1 ? "" : "s"}
                  </span>
                </div>
                {accessToken ? (
                  <button
                    className={subscribe ? "secondary-button" : "pill-button"}
                    type="button"
                    onClick={handleSubscribeChannel}
                  >
                    {subscribe ? (
                      <>
                        <MdNotificationsActive />
                        Subscribed
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                ) : (
                  <Link className="pill-button" to="/signin">
                    Sign in to subscribe
                  </Link>
                )}
              </div>

              <div className="watch-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleToggleLike}
                  disabled={!accessToken}
                >
                  {videoLikeStatus ? <BiSolidLike size={18} /> : <BiLike size={18} />}
                  {videoLikesCount}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleToggleDislike}
                  disabled={!accessToken}
                >
                  {videoDislikeStatus ? <BiSolidDislike size={18} /> : <BiDislike size={18} />}
                  Dislike
                </button>
                <button className="secondary-button" type="button">
                  <PiShareFat size={18} />
                  Share
                </button>
                <button className="secondary-button" type="button">
                  <MdPlaylistAdd size={18} />
                  Playlists
                </button>
              </div>
            </div>

            <div className="panel description-card" style={{ padding: 18 }}>
              <h4>
                {videoDetails?.views || 0} views
                {videoDetails?.createdAt
                  ? ` | ${formatDistanceToNow(new Date(videoDetails.createdAt))} ago`
                  : ""}
              </h4>
              <p style={{ marginTop: 10 }}>
                {videoDetails?.description || "No description yet."}
              </p>
            </div>

            <div className="comment-shell">
              <Comments />
            </div>
          </div>
        </section>

        <aside style={{ display: "grid", gap: 14 }}>
          <div className="panel">
            <p className="page-intro__eyebrow" style={{ marginBottom: 8 }}>
              Up next
            </p>
            <h3 style={{ margin: 0 }}>Recommended videos</h3>
          </div>

          {relatedVideos.map((video) => (
            <VideoCard key={video._id} video={video} variant="list" showPreview={false} />
          ))}
        </aside>
      </div>
    </div>
  );
};

export default WatchVideoDetails;
