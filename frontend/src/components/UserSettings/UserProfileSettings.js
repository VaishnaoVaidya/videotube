import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import EmptyState from "../shared/EmptyState";
import { API_V1_URL } from "../../config/api";

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const host = API_V1_URL;
  const { signIn, userProfile, setUserProfile } = useContext(UserContext);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    username: "",
    bio: "",
    email: "",
  });

  useEffect(() => {
    setProfileForm({
      fullName: userProfile?.fullName || "",
      username: userProfile?.username || "",
      bio: userProfile?.bio || "",
      email: userProfile?.email || "",
    });
  }, [userProfile]);

  const avatarPreview = useMemo(
    () =>
      avatarFile
        ? URL.createObjectURL(avatarFile)
        : userProfile?.avatar || "images/unknown.png",
    [avatarFile, userProfile?.avatar]
  );

  const coverPreview = useMemo(
    () =>
      coverFile
        ? URL.createObjectURL(coverFile)
        : userProfile?.coverImage || "images/cover.jpg",
    [coverFile, userProfile?.coverImage]
  );

  const accessToken = localStorage.getItem("accessToken");

  const updateImage = async (type) => {
    setMessage("");
    setErrorMessage("");

    const selectedFile = type === "avatar" ? avatarFile : coverFile;
    const setter = type === "avatar" ? setAvatarLoading : setCoverLoading;
    const endpoint = type === "avatar" ? "avatar" : "coverImage";
    const fieldName = type === "avatar" ? "avatar" : "coverImage";

    if (!selectedFile) {
      setErrorMessage(`Please choose a ${type} image first.`);
      return;
    }

    if (!accessToken) {
      setErrorMessage("Please sign in first.");
      navigate("/signin");
      return;
    }

    try {
      setter(true);
      const formData = new FormData();
      formData.append(fieldName, selectedFile);

      const response = await axios.patch(`${host}/users/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response?.data?.data;
      if (updatedUser) {
        setUserProfile((prev) => ({
          ...prev,
          ...updatedUser,
        }));
      }

      setMessage(`${type === "avatar" ? "Avatar" : "Cover image"} updated successfully.`);
      if (type === "avatar") {
        setAvatarFile(null);
      } else {
        setCoverFile(null);
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || `Unable to update ${type} right now.`
      );
    } finally {
      setter(false);
    }
  };

  const updateProfileDetails = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!accessToken) {
      setErrorMessage("Please sign in first.");
      navigate("/signin");
      return;
    }

    if (!profileForm.username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }

    try {
      setProfileLoading(true);
      const response = await axios.patch(
        `${host}/users/update-account`,
        {
          fullName: profileForm.fullName,
          username: profileForm.username,
          bio: profileForm.bio,
          email: profileForm.email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedUser = response?.data?.data;
      if (updatedUser) {
        setUserProfile((prev) => ({
          ...prev,
          ...updatedUser,
        }));
      }
      setMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Unable to update profile right now."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  if (!signIn) {
    return (
      <div className="page-shell settings-page">
        <section className="settings-header">
          <div>
            <p className="settings-header__eyebrow">Settings</p>
            <h1 className="settings-header__title">Channel profile</h1>
            <p className="settings-header__description">
              Sign in first to manage the images and profile details attached to your account.
            </p>
          </div>
        </section>
        <EmptyState
          title="You are not signed in"
          description="Once you sign in, you can update your avatar, cover image, name, username, and bio here."
        />
      </div>
    );
  }

  return (
    <div className="page-shell settings-page">
      <section className="settings-header">
        <div>
          <p className="settings-header__eyebrow">Settings</p>
          <h1 className="settings-header__title">Manage your channel profile</h1>
          <p className="settings-header__description">
            Update your avatar, banner, creator name, username, and bio from one place.
          </p>
        </div>
        <div className="settings-header__meta">
          <span className="stat-chip">@{profileForm.username || "channel"}</span>
          <span className="stat-chip">YouTube-style channel setup</span>
        </div>
      </section>

      {(message || errorMessage) ? (
        <div className={`settings-banner ${errorMessage ? "is-error" : "is-success"}`}>
          {errorMessage || message}
        </div>
      ) : null}

      <section className="settings-layout">
        <div className="panel settings-card settings-card--profile">
          <div className="settings-card__heading">
            <h2 style={{ margin: 0 }}>Profile details</h2>
            <span className="settings-card__tag">Public info</span>
          </div>
          <p className="settings-card__copy">
            This information appears on your channel page and around the app.
          </p>
          <form className="form-stack settings-form" onSubmit={updateProfileDetails}>
            <div className="form-field">
              <label htmlFor="profile-fullname">Channel name</label>
              <input
                id="profile-fullname"
                type="text"
                value={profileForm.fullName}
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
                placeholder="Enter your channel name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                type="text"
                value={profileForm.username}
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, username: event.target.value }))
                }
                placeholder="Choose a username"
              />
            </div>

            <div className="form-field">
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" type="email" value={profileForm.email} disabled />
            </div>

            <div className="form-field">
              <label htmlFor="profile-bio">Bio / description</label>
              <textarea
                id="profile-bio"
                rows={6}
                value={profileForm.bio}
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                placeholder="Tell viewers what your channel is about"
              />
            </div>

            <button className="pill-button" type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving profile..." : "Save profile"}
            </button>
          </form>
        </div>

        <div className="settings-media-column">
          <div className="panel settings-card">
            <div className="settings-card__heading">
              <h2 style={{ margin: 0 }}>Avatar</h2>
              <span className="settings-card__tag">Profile</span>
            </div>
            <p className="settings-card__copy">
              Your avatar appears in comments, cards, and channel headers.
            </p>
            <img className="settings-avatar-preview" src={avatarPreview} alt="Avatar preview" />
            <div className="form-field">
              <label htmlFor="avatar-upload">Choose avatar</label>
              <input
                className="settings-file-input"
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
              />
            </div>
            <button
              className="pill-button"
              type="button"
              disabled={avatarLoading}
              onClick={() => updateImage("avatar")}
            >
              {avatarLoading ? "Updating avatar..." : "Update avatar"}
            </button>
          </div>

          <div className="panel settings-card">
            <div className="settings-card__heading">
              <h2 style={{ margin: 0 }}>Cover image</h2>
              <span className="settings-card__tag">Banner</span>
            </div>
            <p className="settings-card__copy">
              Use a wide banner image to make the channel feel more complete.
            </p>
            <img className="settings-cover-preview" src={coverPreview} alt="Cover preview" />
            <div className="form-field">
              <label htmlFor="cover-upload">Choose cover image</label>
              <input
                className="settings-file-input"
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
              />
            </div>
            <button
              className="pill-button"
              type="button"
              disabled={coverLoading}
              onClick={() => updateImage("cover")}
            >
              {coverLoading ? "Updating cover..." : "Update cover"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfileSettings;
