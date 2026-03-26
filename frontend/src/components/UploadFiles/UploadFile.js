import React, { useEffect, useRef, useState } from "react";
import { RiFeedbackLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { MdFileDownload, MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdOutlineDownloading } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { FcProcess } from "react-icons/fc";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { HiUpload } from "react-icons/hi";
import axios from "axios";
import PageIntro from "../shared/PageIntro";
import { API_V1_URL } from "../../config/api";

const UploadFile = () => {
  const host = API_V1_URL;
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(null);
  const [sendThumbnailToBackend, setSendThumbnailToBackend] = useState(null);
  const [updateDownloadThumbnail, setUpdateDownloadThumbnail] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [desCount, setDesCount] = useState(0);
  const [titleCount, setTitleCount] = useState(0);
  const maxDesChars = 5000;
  const maxTitleChars = 100;

  const dataUrlToBlob = (dataUrl) => {
    const base64Data = dataUrl.split(",")[1];
    const binaryData = atob(base64Data);
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i += 1) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: "image/png" });
  };

  const thumbnailsBlobs = thumbnails.map(dataUrlToBlob);

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedFile?.video) {
      setErrorMessage("Please select a video file first.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Please enter a title before publishing.");
      return;
    }

    const fallbackThumbnail =
      sendThumbnailToBackend || selectedThumbnail || thumbnailsBlobs[0] || null;

    if (!fallbackThumbnail) {
      setErrorMessage("Please wait for thumbnails to generate or upload one manually.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("videoFile", selectedFile.video);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("thumbnail", fallbackThumbnail, "thumbnail.png");

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setErrorMessage("Please sign in before publishing a video.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${host}/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status) {
        navigate(`/channel/${response.data.data?.owner?.username}`);
      }
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to publish video right now.";
      setErrorMessage(backendMessage);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !selectedFile) {
      return undefined;
    }

    const generateThumbnails = async () => {
      const duration = video.duration || 0;
      const portion = duration / 3 || 1;
      const thumbnailsArray = [];

      try {
        for (let i = 1; i <= 3; i += 1) {
          const timestamp = portion * i;
          video.currentTime = timestamp;

          await new Promise((resolve) => {
            video.addEventListener(
              "canplay",
              function onCanPlay() {
                resolve();
                video.removeEventListener("canplay", onCanPlay);
              },
              { once: true }
            );
          });

          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          thumbnailsArray.push(canvas.toDataURL());
        }
        setThumbnails(thumbnailsArray);
        if (!sendThumbnailToBackend && thumbnailsArray.length > 0) {
          const firstThumbnailBlob = dataUrlToBlob(thumbnailsArray[0]);
          if (firstThumbnailBlob) {
            setSelectedThumbnailIndex(0);
            setSendThumbnailToBackend(firstThumbnailBlob);
          }
        }
      } catch (error) {
        console.error("Error setting currentTime:", error);
      }
    };

    generateThumbnails();
    return undefined;
  }, [selectedFile]);

  const handleDescription = (e) => {
    const desValue = e.target.value;
    setDescription(desValue);
    setDesCount(desValue.length);
  };

  const handleTitle = (e) => {
    const titleValue = e.target.value;
    setTitle(titleValue);
    setTitleCount(titleValue.length);
  };

  const handleSelectedVideo = (event) => {
    const video = event.target.files[0];

    if (video && video.type.startsWith("video/")) {
      const blobUrl = URL.createObjectURL(video);
      setLoading(true);
      setErrorMessage("");
      setThumbnails([]);
      setThumbnail(null);
      setSelectedThumbnail(null);
      setSelectedThumbnailIndex(null);
      setSendThumbnailToBackend(null);
      setTimeout(() => {
        setSelectedFile({ video, blobUrl });
        setLoading(false);
      }, 1200);
    } else {
      setSelectedFile(null);
      setLoading(false);
      setErrorMessage("Please choose a valid video file.");
    }
  };

  const handleVideoSelection = (video) => {
    if (video && video.type.startsWith("video/")) {
      const blobUrl = URL.createObjectURL(video);
      setLoading(true);
      setErrorMessage("");
      setThumbnails([]);
      setThumbnail(null);
      setSelectedThumbnail(null);
      setSelectedThumbnailIndex(null);
      setSendThumbnailToBackend(null);
      setTimeout(() => {
        setSelectedFile({ video, blobUrl });
        setLoading(false);
      }, 1200);
    } else {
      setSelectedFile(null);
      setLoading(false);
      setErrorMessage("Please choose a valid video file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer?.files?.[0];
    handleVideoSelection(droppedFile);
  };

  const handleClose = () => navigate(-1);

  const handleCopy = () => {
    const cleanURL = selectedFile.blobUrl.replace("blob:", "blob:");
    navigator.clipboard.writeText(cleanURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleDownloadThumbnail = () => {
    if (!thumbnail) {
      return;
    }

    const link = document.createElement("a");
    link.href = thumbnail;
    link.download = "thumbnail.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectedThumbnail = (index) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const nextThumbnail = index === -1 ? selectedThumbnail : thumbnailsBlobs[index];
    if (!(nextThumbnail instanceof Blob || nextThumbnail instanceof File)) {
      return;
    }

    setSelectedThumbnailIndex(index);
    if (video.poster) {
      URL.revokeObjectURL(video.poster);
    }
    video.poster = URL.createObjectURL(nextThumbnail);
    setSendThumbnailToBackend(nextThumbnail);
    video.load();
  };

  const handleThumbnailCreation = (event) => {
    const image = event.target.files[0];
    if (image && image.type.startsWith("image/")) {
      setThumbnail(image);
      setSelectedThumbnail(image);
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div className="page-shell upload-layout">
      <PageIntro
        eyebrow="Creator studio"
        title="Upload and package your next video"
        description="The publishing flow now uses the same visual system as the rest of the app, with a clearer preview, thumbnail selection, and metadata editing."
        action={
          <button className="secondary-button" type="button" onClick={handleClose}>
            <RxCross2 size={18} />
            Close
          </button>
        }
      />

      {!selectedFile ? (
        <section
          className={`upload-dropzone ${isDragActive ? "is-drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {loading ? (
            <MdOutlineDownloading style={{ width: 96, height: 96 }} />
          ) : (
            <label htmlFor="fileInput">
              <MdUpload style={{ width: 96, height: 96, cursor: "pointer" }} />
            </label>
          )}
          <h2 style={{ margin: 0 }}>Drop a video or select a file</h2>
          <p style={{ margin: 0, color: "#94a3b8" }}>
            Your upload stays private until you publish it.
          </p>
          {errorMessage ? <p style={{ margin: 0, color: "#fb7185" }}>{errorMessage}</p> : null}
          <input
            disabled={loading}
            id="fileInput"
            type="file"
            accept="video/*"
            onChange={handleSelectedVideo}
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput" className="pill-button" style={{ cursor: "pointer" }}>
            Select files
          </label>
        </section>
      ) : (
        <section className="upload-grid">
          <div className="panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>Video details</h2>
                <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
                  {selectedFile?.video?.name}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="icon-button" type="button">
                  <RiFeedbackLine size={20} />
                </button>
                <button className="icon-button" type="button" onClick={handleClose}>
                  <RxCross2 size={20} />
                </button>
              </div>
            </div>

            <div className="form-stack">
              <div className="form-field">
                <label htmlFor="video-title">Title ({titleCount}/{maxTitleChars})</label>
                <textarea
                  id="video-title"
                  value={title}
                  onChange={handleTitle}
                  rows={3}
                  placeholder="Write a clear, memorable title"
                />
              </div>

              <div className="form-field">
                <label htmlFor="video-description">
                  Description ({desCount}/{maxDesChars})
                </label>
                <textarea
                  id="video-description"
                  value={description}
                  onChange={handleDescription}
                  rows={8}
                  placeholder="Tell viewers what this video is about"
                />
              </div>

              <div className="form-field">
                <label>Thumbnail</label>
                <div className="thumbnail-list">
                  {thumbnail ? (
                    <div
                      className={`thumbnail-option ${
                        selectedThumbnailIndex === -1 ? "is-selected" : ""
                      }`}
                      onClick={() => handleSelectedThumbnail(-1)}
                    >
                      <img src={URL.createObjectURL(thumbnail)} alt="Uploaded thumbnail" />
                      <div style={{ position: "absolute", top: 8, right: 8 }}>
                        <button
                          className="icon-button"
                          type="button"
                          style={{ width: 28, height: 28 }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setUpdateDownloadThumbnail((tap) => !tap);
                          }}
                        >
                          <BsThreeDotsVertical size={12} />
                        </button>
                        {updateDownloadThumbnail ? (
                          <div
                            className="panel"
                            style={{ position: "absolute", top: 36, right: 0, width: 150, padding: 8 }}
                          >
                            <label style={{ display: "flex", gap: 8, cursor: "pointer", padding: 8 }}>
                              <RiImageAddFill size={18} />
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  setUpdateDownloadThumbnail(false);
                                  handleThumbnailCreation(e);
                                }}
                                style={{ display: "none" }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={handleDownloadThumbnail}
                              style={{ display: "flex", gap: 8, padding: 8, width: "100%", background: "transparent", color: "white", cursor: "pointer" }}
                            >
                              <MdFileDownload size={18} />
                              Download
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <label className="thumbnail-option" htmlFor="thumbnail-upload">
                      <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#94a3b8" }}>
                        <div style={{ textAlign: "center" }}>
                          <RiImageAddFill size={28} />
                          <div style={{ marginTop: 6, fontSize: 12 }}>Upload thumbnail</div>
                        </div>
                      </div>
                      <input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        onChange={handleThumbnailCreation}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}

                  {thumbnailsBlobs.map((canvasThumbnail, index) => (
                    <div
                      key={index}
                      className={`thumbnail-option ${
                        selectedThumbnailIndex === index ? "is-selected" : ""
                      }`}
                      onClick={() => handleSelectedThumbnail(index)}
                    >
                      <img src={URL.createObjectURL(canvasThumbnail)} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#cbd5e1" }}>
                  <HiUpload color="#38bdf8" size={20} />
                  <FcProcess size={20} />
                  <IoIosCheckmarkCircleOutline color="#38bdf8" size={20} />
                  <span>Checks complete. No issues found.</span>
                </div>

                {errorMessage ? (
                  <span style={{ color: "#fb7185", width: "100%" }}>{errorMessage}</span>
                ) : null}

                <button className="pill-button" type="button" onClick={handleUploadVideo}>
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>

          <aside className="upload-preview-card">
            <video
              ref={videoRef}
              style={{ width: "100%", borderRadius: 16, background: "#000" }}
              controls
              poster={thumbnail}
            >
              <source src={selectedFile.blobUrl} type={selectedFile?.type} />
              Your browser does not support the video tag.
            </video>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Video link</strong>
                <button className="icon-button" type="button" onClick={handleCopy}>
                  <MdOutlineContentCopy size={18} />
                </button>
              </div>
              <span style={{ color: "#38bdf8", wordBreak: "break-all" }}>
                {selectedFile.blobUrl}
              </span>
              {copied ? <span style={{ color: "#34d399" }}>Copied to clipboard</span> : null}
              <div>
                <strong>File name</strong>
                <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>{selectedFile?.video?.name}</p>
              </div>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
};

export default UploadFile;
