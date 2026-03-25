import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineBars3 } from "react-icons/hi2";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoMdNotificationsOutline, IoMdHome } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineHistory } from "react-icons/md";
import { LuUserSquare } from "react-icons/lu";
import { BsCollectionPlayFill } from "react-icons/bs";
import { RiPlayListAddLine } from "react-icons/ri";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import Search from "../SearchSection/Search";
import UserSettings from "../UserSettings/UserSettings";
import NotificationsPanel from "./NotificationsPanel";
import UserContext from "../../context/UserContext";

const topicChips = [
  { label: "All", to: "/" },
  { label: "Music", to: "/?topic=music" },
  { label: "Gaming", to: "/?topic=gaming" },
  { label: "Podcasts", to: "/?topic=podcasts" },
  { label: "React", to: "/?topic=react" },
  { label: "Live", to: "/?topic=live" },
  { label: "News", to: "/?topic=news" },
  { label: "Mixes", to: "/?topic=mix" },
  { label: "Recently uploaded", to: "/?topic=recent" },
];

const Header = () => {
  const host = "https://videotube-backend-5fg2.onrender.com/api/v1";
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, setSignIn, sidebar, setSidebar, userProfile, setUserProfile } =
    useContext(UserContext);
  const [userDetails, setUserDetails] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);

  const navGroups = useMemo(
    () => [
      {
        label: "Main",
        items: [
          { label: "Home", to: "/", icon: <IoMdHome size={22} /> },
          { label: "Subscriptions", to: "/subscriptions", icon: <RiPlayListAddLine size={22} /> },
        ],
      },
      {
        label: "You",
        items: [
          { label: "Dashboard", to: "/dashboard", icon: <HiOutlineChartBarSquare size={22} /> },
          { label: "Liked videos", to: "/likedvideos", icon: <AiOutlineLike size={22} /> },
          { label: "History", to: "/history", icon: <MdOutlineHistory size={22} /> },
          {
            label: "Your channel",
            to: userProfile?.username ? `/channel/${userProfile.username}` : "/signin",
            icon: <LuUserSquare size={22} />,
          },
        ],
      },
      {
        label: "Explore",
        items: [{ label: "Collections", to: "/collections", icon: <BsCollectionPlayFill size={22} /> }],
      },
    ],
    [userProfile?.username]
  );

  const showTopicBar =
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/dashboard" &&
    location.pathname !== "/search" &&
    location.pathname !== "/channel/upload" &&
    !location.pathname.startsWith("/settings");

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshResponse = await axios.post(
        `${host}/users/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );

      if (refreshResponse.data.success) {
        setSignIn(true);
      } else if (refreshResponse.data.message === "jwt malformed") {
        navigate("/signin");
      }
    } catch (error) {
      setSignIn(false);
      setUserProfile({});
    }
  }, [host, refreshToken, navigate, setSignIn, setUserProfile]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setSignIn(false);
          setUserProfile({});
          return;
        }

        const response = await axios.get(`${host}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          setSignIn(true);
          setUserProfile(response.data.data.user[0]);
        } else if (response.data.status === 401) {
          setRefreshToken(response.data.refreshToken);
          await refreshAccessToken();
        }
      } catch (error) {
        setSignIn(false);
        setUserProfile({});
      }
    };

    fetchUser();
  }, [host, refreshAccessToken, setSignIn, setUserProfile]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const subscriberId = userProfile?._id;

      if (!accessToken || !subscriberId) {
        setSubscriptions([]);
        return;
      }

      try {
        const response = await axios.get(`${host}/subscriptions/u/${subscriberId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSubscriptions(response.data.data || []);
      } catch (error) {
        setSubscriptions([]);
      }
    };

    fetchSubscriptions();
  }, [host, userProfile?._id]);

  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  const notificationItems = useMemo(() => {
    if (!signIn) {
      return [
        {
          id: "signin",
          title: "Sign in to personalize VideoTube",
          body: "Unlock subscriptions, watch history, likes, and creator tools.",
          cta: "Open sign in",
          to: "/signin",
          icon: "bell",
          unread: true,
        },
        {
          id: "signup",
          title: "Create your channel",
          body: "Set up your creator identity and start building a YouTube-style profile.",
          cta: "Create account",
          to: "/signup",
          icon: "profile",
          unread: true,
        },
      ];
    }

    const items = [];

    if (!userProfile?.avatar || !userProfile?.coverImage || !userProfile?.bio) {
      items.push({
        id: "profile-complete",
        title: "Complete your channel profile",
        body: "Add your avatar, cover image, and bio so your channel looks polished.",
        cta: "Open settings",
        to: "/settings/profile",
        icon: "profile",
        unread: true,
      });
    }

    items.push({
      id: "upload-video",
      title: "Publish your next video",
      body: "Your channel looks stronger with fresh content and custom thumbnails.",
      cta: "Open upload",
      to: "/channel/upload",
      icon: "upload",
      unread: true,
    });

    if (!subscriptions.length) {
      items.push({
        id: "discover-creators",
        title: "Discover more creators",
        body: "Follow channels to make the home feed and notifications feel more alive.",
        cta: "Browse home",
        to: "/",
        icon: "optimize",
        unread: false,
      });
    } else {
      items.push({
        id: "subscriptions",
        title: "Check subscription updates",
        body: "Your followed creators may have new uploads waiting in the subscriptions feed.",
        cta: "Open subscriptions",
        to: "/subscriptions",
        icon: "update",
        unread: false,
      });
    }

    return items;
  }, [signIn, subscriptions.length, userProfile?.avatar, userProfile?.bio, userProfile?.coverImage]);

  const unreadNotifications = notificationItems.filter((item) => item.unread).length;

  return (
    <div
      onClick={() => {
        if (userDetails) {
          setUserDetails(false);
        }
        if (notificationsOpen) {
          setNotificationsOpen(false);
        }
      }}
    >
      <header className="app-topbar">
        <div className="app-brand">
          <button
            type="button"
            className="icon-button"
            onClick={(event) => {
              event.stopPropagation();
              setSidebar((toggle) => !toggle);
            }}
            aria-label="Toggle sidebar"
          >
            <HiOutlineBars3 size={24} />
          </button>

          <Link to="/" className="app-brand">
            <img
              className="brand-mark"
              src="https://as2.ftcdn.net/v2/jpg/02/55/94/55/1000_F_255945532_gXYb4gPaatBY39i9KIte3K38KH3lJYIq.jpg"
              alt="VideoTube"
            />
            <div className="brand-copy">
              <strong>VIDEOTUBE</strong>
              <span>Stream the moment</span>
            </div>
          </Link>
        </div>

        <Search />

        <div className="topbar-actions" onClick={(event) => event.stopPropagation()}>
          {signIn ? (
            <>
              <Link className="icon-button" to="/channel/upload" aria-label="Upload video">
                <MdOutlineVideoCall size={22} />
              </Link>
              <button
                type="button"
                className="icon-button notifications-trigger"
                aria-label="Notifications"
                onClick={() => {
                  setUserDetails(false);
                  setNotificationsOpen((open) => !open);
                }}
              >
                <IoMdNotificationsOutline size={22} />
                {unreadNotifications ? (
                  <span className="notifications-badge">{unreadNotifications}</span>
                ) : null}
              </button>
              <button
                type="button"
                className="profile-chip"
                onClick={() => {
                  setNotificationsOpen(false);
                  setUserDetails((open) => !open);
                }}
              >
                <div className="profile-chip__meta">
                  <strong>{userProfile?.fullName || "Creator"}</strong>
                  <span>@{userProfile?.username || "guest"}</span>
                </div>
                <img src={userProfile?.avatar || "images/unknown.png"} alt="Profile" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="icon-button notifications-trigger"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <IoMdNotificationsOutline size={22} />
                {unreadNotifications ? (
                  <span className="notifications-badge">{unreadNotifications}</span>
                ) : null}
              </button>
              <Link className="auth-ghost" to="/signup">
                Create account
              </Link>
              <Link className="auth-button" to="/signin">
                Sign in
              </Link>
            </>
          )}

          <NotificationsPanel
            open={notificationsOpen}
            items={notificationItems}
            onClose={() => setNotificationsOpen(false)}
          />
          <UserSettings
            userDetails={userDetails}
            userProfile={userProfile}
            handleUserDetails={() => setUserDetails((open) => !open)}
          />
        </div>
      </header>

      <aside
        className={`app-sidebar ${showTopicBar ? "has-topic-bar" : "no-topic-bar"} ${
          sidebar ? "is-open" : "is-closed"
        }`}
      >
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.map((item) => (
              <Link
                key={item.label}
                className={`nav-item ${isActive(item.to) ? "is-active" : ""}`}
                to={item.to}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}

        {sidebar ? (
          <div className="nav-group" style={{ marginTop: 22 }}>
            <p className="nav-label">Subscriptions</p>
            <div className="subscription-list">
              {subscriptions.length ? (
                subscriptions.map((subscription, index) => (
                  <div className="subscription-item" key={`${subscription?.subscriber?._id || index}`}>
                    <img
                      src={subscription?.subscriber?.avatar || "images/unknown.png"}
                      alt={subscription?.subscriber?.username || "Subscription"}
                    />
                    <div className="subscription-item__meta">
                      <strong>
                        {subscription?.subscriber?.fullName ||
                          subscription?.subscriber?.username ||
                          "Creator"}
                      </strong>
                      <span>@{subscription?.subscriber?.username || "channel"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="subscription-item">
                  <div className="subscription-item__meta">
                    <strong>No subscriptions yet</strong>
                    <span>Follow channels to see them here</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </aside>

      {showTopicBar ? (
        <div className="topic-bar">
          <div className="topic-bar__track">
            {topicChips.map((chip) => {
              const isHomeAll = chip.to === "/" && location.pathname === "/" && !location.search;
              const isSelected = chip.to !== "/" ? location.search === chip.to.replace("/", "") && location.pathname === "/" : isHomeAll;

              return (
                <Link
                  key={chip.label}
                  className={`topic-chip ${isSelected ? "is-active" : ""}`}
                  to={chip.to}
                >
                  {chip.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
