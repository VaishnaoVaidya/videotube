import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const formatViews = (views) => {
  const count = Number(views) || 0;
  return `${count} ${count === 1 ? "view" : "views"}`;
};

const VideoCard = ({ video, variant = "grid", showPreview = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!video) {
    return null;
  }

  const ownerName = video?.owner?.fullName || video?.owner?.username || "Unknown creator";
  const videoTitle = video?.title || video?.tittle || "Untitled video";
  const createdAt = video?.createdAt ? formatDistanceToNow(new Date(video.createdAt)) : null;
  const cardClassName = variant === "list" ? "video-card video-card--list" : "video-card";

  return (
    <article className={cardClassName}>
      <Link
        className="video-card__media"
        to={`/watch/${video._id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showPreview && isHovered && video.videoFile ? (
          <video
            className="video-card__thumbnail"
            src={video.videoFile}
            autoPlay
            muted
            controls={variant === "list"}
          />
        ) : (
          <img
            className="video-card__thumbnail"
            src={video.thumbnail || "images/1.png"}
            alt={videoTitle}
          />
        )}
        <span className="video-card__badge">{formatViews(video.views)}</span>
      </Link>

      <div className="video-card__content">
        <Link className="video-card__avatar-link" to={`/${video?.owner?.username || ""}`}>
          <img
            className="video-card__avatar"
            src={video?.owner?.avatar || "images/unknown.png"}
            alt={ownerName}
          />
        </Link>

        <div className="video-card__details">
          <Link className="video-card__title" to={`/watch/${video._id}`}>
            {videoTitle}
          </Link>
          <p className="video-card__meta">{ownerName}</p>
          <p className="video-card__meta">
            {formatViews(video.views)}
            {createdAt ? ` • ${createdAt} ago` : ""}
          </p>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
