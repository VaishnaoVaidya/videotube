import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../shared/PageIntro";
import EmptyState from "../shared/EmptyState";
import { API_V1_URL } from "../../config/api";

const Dashboard = () => {
  const host = API_V1_URL;
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        setLoading(true);
        setError("");

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const [statsResponse, videosResponse] = await Promise.all([
          axios.get(`${host}/dashboard/stats`, config),
          axios.get(`${host}/dashboard/videos`, config),
        ]);

        setStats(statsResponse.data.data);
        setVideos(videosResponse.data.data || []);
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Unable to load dashboard right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const overviewCards = useMemo(() => {
    if (!stats) {
      return [];
    }

    return [
      { label: "Total uploads", value: stats.overview.totalVideos, tone: "warm" },
      { label: "Total views", value: stats.overview.totalViews, tone: "cool" },
      { label: "Video likes", value: stats.overview.totalLikes, tone: "success" },
      { label: "Comments", value: stats.overview.totalComments, tone: "neutral" },
      { label: "Watch history count", value: stats.overview.watchCount, tone: "muted" },
    ];
  }, [stats]);

  const chartMax = useMemo(() => {
    if (!stats?.monthlyPerformance?.length) {
      return 1;
    }

    return Math.max(...stats.monthlyPerformance.map((item) => item.views || 0), 1);
  }, [stats]);

  const bestVideo = stats?.topVideos?.[0];

  if (loading) {
    return (
      <div className="page-shell">
        <PageIntro
          eyebrow="Dashboard"
          title="Loading channel analytics"
          description="Pulling together your creator performance metrics and latest uploads."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <PageIntro
          eyebrow="Dashboard"
          title="Creator analytics"
          description="Track how your videos are performing and what to improve next."
        />
        <div className="settings-banner is-error">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-shell">
        <PageIntro
          eyebrow="Dashboard"
          title="Creator analytics"
          description="Track how your videos are performing and what to improve next."
        />
        <EmptyState
          title="Dashboard is empty"
          description="Upload a few videos and interact with the platform to generate analytics."
        />
      </div>
    );
  }

  return (
    <div className="page-shell dashboard-page">
      <PageIntro
        eyebrow="Dashboard"
        title={`Welcome back, ${stats.profile.fullName || stats.profile.username}`}
        description="A creator-studio style overview of your uploads, audience momentum, and the videos pulling the strongest engagement."
        action={
          <Link className="pill-button" to="/channel/upload">
            Upload video
          </Link>
        }
      />

      <section className="dashboard-overview">
        {overviewCards.map((card) => (
          <article key={card.label} className={`dashboard-stat dashboard-stat--${card.tone}`}>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-highlight">
        <article className="panel dashboard-highlight__feature">
          <p className="dashboard-highlight__eyebrow">Channel snapshot</p>
          <h2>
            {stats.profile.fullName || "Your channel"} is ready for the next publishing push
          </h2>
          <p>
            {stats.overview.totalVideos
              ? `You have ${stats.overview.totalVideos} uploads generating ${stats.overview.totalViews} total views so far. Keep the momentum going with another release and a polished profile.`
              : "Start with your first upload to unlock creator analytics, engagement stats, and trend tracking."}
          </p>
          <div className="dashboard-highlight__actions">
            <Link className="pill-button" to={`/channel/${stats.profile.username}`}>
              View channel
            </Link>
            <Link className="secondary-button" to="/settings/profile">
              Edit profile
            </Link>
          </div>
        </article>

        <article className="panel dashboard-highlight__mini">
          <p className="dashboard-highlight__eyebrow">Top signal</p>
          {bestVideo ? (
            <>
              <h3>{bestVideo.title}</h3>
              <p>
                {bestVideo.views} views | {bestVideo.likesCount} likes | {bestVideo.commentsCount} comments
              </p>
              <span className="stat-chip">Score {bestVideo.score}</span>
            </>
          ) : (
            <>
              <h3>No breakout video yet</h3>
              <p>Your first high-performing upload will show up here once the channel has activity.</p>
            </>
          )}
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="panel dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Monthly performance</h2>
              <p>Views and upload activity across your latest publishing months.</p>
            </div>
          </div>

          <div className="dashboard-chart">
            {(stats.monthlyPerformance || []).length ? (
              stats.monthlyPerformance.map((item) => (
                <div key={item._id} className="dashboard-chart__item">
                  <div
                    className="dashboard-chart__bar"
                    style={{ height: `${Math.max((item.views / chartMax) * 180, 14)}px` }}
                  />
                  <strong>{item.views}</strong>
                  <span>{item._id}</span>
                  <small>{item.uploads} uploads</small>
                </div>
              ))
            ) : (
              <EmptyState
                title="No monthly performance yet"
                description="Once you upload videos, chart data will appear here."
              />
            )}
          </div>
        </div>

        <div className="panel dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Top performing videos</h2>
              <p>Ranked by a blend of views, likes, and comments.</p>
            </div>
          </div>

          <div className="dashboard-list">
            {(stats.topVideos || []).length ? (
              stats.topVideos.map((video) => (
                <div key={video._id} className="dashboard-list__item">
                  <div>
                    <strong>{video.title}</strong>
                    <p>
                      {video.views} views | {video.likesCount} likes | {video.commentsCount} comments
                    </p>
                  </div>
                  <span className="stat-chip">Score {video.score}</span>
                </div>
              ))
            ) : (
              <EmptyState
                title="No top videos yet"
                description="Upload content to start ranking videos here."
              />
            )}
          </div>
        </div>
      </section>

      <section className="panel dashboard-panel">
        <div className="dashboard-panel__header">
          <div>
            <h2>Uploaded videos</h2>
            <p>Your recent uploads and their current performance snapshot.</p>
          </div>
        </div>

        {videos.length ? (
          <div className="dashboard-table">
            <div className="dashboard-table__head">
              <span>Video</span>
              <span>Status</span>
              <span>Views</span>
              <span>Created</span>
            </div>
            {videos.map((video) => (
              <div key={video._id} className="dashboard-table__row">
                <div className="dashboard-table__video">
                  <img src={video.thumbnail || "images/1.png"} alt={video.title || video.tittle} />
                  <div>
                    <strong>{video.title || video.tittle}</strong>
                    <p>{video.description || "No description"}</p>
                  </div>
                </div>
                <span>{video.isPublished ? "Published" : "Draft"}</span>
                <span>{video.views || 0}</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No uploads yet"
            description="Publish a video to start building out your dashboard."
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
