import React, { useEffect, useRef, useState } from "react";
import { RiFeedbackLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { MdFileDownload, MdUpload } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { MdOutlineDownloading } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { FcProcess } from "react-icons/fc";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { HiUpload } from "react-icons/hi";

import axios from "axios";

const UploadFile = () => {
  const host = "http://localhost:8000/api/v1";
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const [thumbnails, setThumbnails] = useState([]);

  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  console.log("selectedFile:", selectedFile);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(null);
  const [sendThumbnailToBackend, setSendThumbnailToBackend] = useState(null);
  const [updateDownloadThumbnail, setUpdateDownloadThumbnail] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setPublished] = useState(false);
  const [desCount, setDesCount] = useState(0);
  const [titleCount, setTitleCount] = useState(0);
  const maxDesChars = 5000;
  const maxTitleChars = 100;

  // Get blob or file from base64-encoded representations of images.
  const thumbnailsBlobs = thumbnails.map((dataUrl) => {
    // Extract the base64-encoded data part
    const base64Data = dataUrl.split(",")[1];
    // Convert base64 to binary
    const binaryData = atob(base64Data);
    // Create a Uint8Array from binary data
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    // Create a Blob from Uint8Array
    return new Blob([uint8Array], { type: "image/png" }); // Adjust the MIME type accordingly
  });

  //backend fetching
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      //send form data
      const formData = new FormData();
      formData.append("videoFile", selectedFile.video);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", sendThumbnailToBackend);

      // Check if there's a stored access token in localStorage
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`${host}/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for handling file uploads
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status) {
        setLoading(false)
        navigate(`/channel/${response.data.data?.owner?.username}`);
      }

      console.log("Response Data Type:", response.data.data);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // The request was made, but the server responded with an error status
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from the server:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error during request setup:", error.message);
      }
    }
  };

  // generate canvas thumbnails

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      console.error("Video element is null");
      return;
    }

    const generateThumbnails = async () => {
      const duration = video.duration;
      const portion = duration / 3;

      const thumbnailsArray = [];

      try {
        for (let i = 1; i <= 3; i++) {
          const timestamp = portion * i;

          video.currentTime = timestamp;

          // Wait for the video to be ready to play
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

          // Create a thumbnail from the current frame
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL();

          thumbnailsArray.push(thumbnailDataUrl);
        }
        setThumbnails(thumbnailsArray);
        setTimeout(() => {
          setThumbnails(thumbnailsArray);
        }, 5000);
      } catch (error) {
        console.error("Error setting currentTime:", error);
      }
    };

    generateThumbnails();

    return () => {
      // Clean up event listeners
      video.removeEventListener("canplay", null);
    };
  }, [videoRef.current]);

  const handleDescription = (e) => {
    let desValue = e.target.value;
    if (desValue > maxDesChars) {
    }
    setDescription(desValue);
    setDesCount(desValue.length);
  };

  const handleTitle = (e) => {
    let titleValue = e.target.value;

    if (titleValue.length > maxTitleChars) {
      // Truncate the title to the maximum allowed characters
      // titleValue = titleValue.slice(0, maxTitleChars);
    }

    setTitle(titleValue);
    setTitleCount(titleValue.length);
  };

  const handleSelectedVideo = (event) => {
    const video = event.target.files[0];

    if (video && video.type.startsWith("video/")) {
      console.log("Selected video File:", video);
      console.log("Name:", video.name);

      // Create a Blob URL for the video
      const blobUrl = URL.createObjectURL(video);

    

      setLoading(true);

      // Log video information after a delay
      setTimeout(() => {
          // Update the selectedFile state with both the video object and Blob URL
      setSelectedFile({ video, blobUrl });
        setLoading(false);
        console.log("Duration:", video.duration);
      }, 5000);
    } else {
      console.log("Selected File is not a video or invalid:", video);
      setSelectedFile(null);
      setLoading(false);
    }
  };

  const handleUpdateDeleteThumbnailToggle = () => {
    setUpdateDownloadThumbnail((tap) => !tap);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleCopy = () => {
    const cleanURL = selectedFile.blobUrl.replace("blob:", "blob:");
    navigator.clipboard.writeText(cleanURL).then(() => {
      setCopied(true);
      // alert("link copied to clipboard");
      console.log("copied successfully: ", copied);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  };

  const handleDownloadThumbnail = () => {
    // Ensure there is a valid thumbnail URL
    if (!thumbnail) {
      console.error("Thumbnail URL is not available.");
      return;
    }

    // Create a link element
    const link = document.createElement("a");

    // Set the href attribute to the thumbnail data URL
    link.href = thumbnail;

    // Set the download attribute to specify the filename
    link.download = "thumbnail.png";

    // Set the link to be invisible
    link.style.display = "none";

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger a click on the link to initiate the download
    link.click();

    // Remove the link from the document body
    document.body.removeChild(link);
  };

  const handleSelectedThumbnail = (index) => {
    const video = videoRef.current;

    if (index === -1) {
      const thumbnail = selectedThumbnail;
      setSelectedThumbnailIndex(index);

      if (thumbnail instanceof Blob || thumbnail instanceof File) {
        console.log("Creating object URL for valid thumbnail");
        if (video.poster) {
          URL.revokeObjectURL(video.poster);
        }
        video.poster = URL.createObjectURL(thumbnail);
        console.log(`thumbnailURL ${index}: ${video.poster}`);
        console.log("videoRef.current:", videoRef.current);

        // Pass the selected thumbnail to the backend
        setSendThumbnailToBackend(thumbnail);
      } else {
        console.error("Invalid thumbnail data:", thumbnail);
      }

      console.log("selectedThumbnail:", selectedThumbnail);
    } else if (thumbnailsBlobs[index]) {
      const thumbnail = thumbnailsBlobs[index];
      setSelectedThumbnailIndex(index);

      if (thumbnail instanceof Blob || thumbnail instanceof File) {
        console.log("Creating object URL for valid thumbnail");
        if (video.poster) {
          URL.revokeObjectURL(video.poster);
        }
        video.poster = URL.createObjectURL(thumbnail);
        console.log(`thumbnailURL ${index}: ${video.poster}`);
        console.log("videoRef.current:", videoRef.current);

        // Pass the selected thumbnail to the backend
        setSendThumbnailToBackend(thumbnail);
      } else {
        console.error("Invalid thumbnail data:", thumbnail);
      }
    } else {
      alert("Error: handleSelectedThumbnail");
    }
    // Reload the video poster
    video.load();

    // Now you can use thumbnailURL as needed
    console.log(`Thumbnail URL: ${index}`);
  };

  const handleThumbnailCreation = (event) => {
    const image = event.target.files[0];

    if (image && image.type.startsWith("image/")) {
      console.log("Image thumbnail:", image);
      setThumbnail(image);
      setSelectedThumbnail(image);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);

        return;
      }, 3000);
    }
  };

  return (
    <>
      {!selectedFile && (
        <div
          style={{
            flex: 1,
            background: "#282828",
            width: "70vw",
            height: "90vh",
            position: "fixed",
            top: 50,
            left: 240,
            borderRadius: 25,
          }}
        >
          <ul
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>Upload Video</h3>
            </div>
            <div style={{ paddingInline: 20 }}>
              <RiFeedbackLine
                style={{ paddingRight: 10, cursor: "pointer" }}
                size={25}
              />
              <RxCross2
                style={{ cursor: "pointer" }}
                onClick={handleClose}
                size={25}
              />
            </div>
          </ul>

          <hr style={{ width: "95%", marginTop: -13 }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: 140,
            }}
          >
            <>
              {" "}
              {loading ? (
                <MdOutlineDownloading
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "#1a181d",
                    padding: 20,
                    cursor: "pointer",
                  }}
                />
              ) : (
                <label htmlFor="fileInput">
                  <MdUpload
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "#1a181d",
                      padding: 20,
                      cursor: "pointer",
                    }}
                  />
                </label>
              )}
            </>

            <h4 style={{ marginTop: 20 }}>
              Drag and drop video files to upload
            </h4>
            <p style={{ marginTop: -13, color: "#bab5b5" }}>
              Your videos will be private until you publish them.
            </p>

            <input
              style={{
                display: "none",
              }}
              id="fileInput"
              type="file"
              accept="video/*"
              onChange={handleSelectedVideo}
              placeholder="SELECT FILES"
            />

            <p>{selectedFile?.video?.name ? selectedFile?.video?.name :  selectedFile ? "invalid file type" : ""}</p>

            <label
              htmlFor="fileInput"
              style={{
                marginTop: 20,
                fontSize: 14,
                fontWeight: "550",
                color: "#000",
                background: loading ? "white" : "#2c9af9",
                paddingInline: 10,
                paddingBlock: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              SELECT FILES
            </label>
          </div>
        </div>
      )}

      {selectedFile && (
        <div
          style={{
            flex: 1,
            background: "#282828",
            width: 1000,
            position: "fixed",
            top: 50,
            left: 290,
            // left: 50,
            borderRadius: 10,
            zIndex: 100,
            opacity: 1,
          }}
        >
          <ul
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>
                {selectedFile?.video?.name &&
                selectedFile?.video?.name.length > 44
                  ? `${selectedFile?.video?.name.substring(0, 44)}...`
                  : selectedFile?.video?.name}
              </h3>
            </div>
            <div style={{ paddingInline: 20 }}>
              <RiFeedbackLine
                style={{ paddingRight: 10, cursor: "pointer" }}
                size={25}
              />
              <RxCross2
                style={{ cursor: "pointer" }}
                onClick={handleClose}
                size={25}
              />
            </div>
          </ul>

          <hr style={{ width: "95%", marginTop: -13 }} />
          <div
            style={{
              height: 450,
              scrollbarWidth: "thin",
              scrollbarColor: "#606060 #282828",
              display: "flex",
              flexDirection: "row",
              marginBlock: 10,
              marginLeft: 30,
              overflowY: "overlay",
              overflowX: "hidden",
              gap: 30,
            }}
          >
            {/* Video Details */}

            <forms
              style={{
                width: 550,
                height: 350,
                position: "relative",
                right: 0,
              }}
            >
              <h2 style={{ fontWeight: "400" }}>Details</h2>

              {/* TITLE */}

              <div
                style={{
                  border:
                    titleCount > 100 ? "1px solid red" : "1px solid #2c9af9",
                  width: 500,
                  height: "auto",
                  borderRadius: 5,
                  position: "relative",
                  color: "white",
                  background: "#282828",
                  padding: 10,
                  overflowY: "hidden",
                  overflowX: "hidden",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#606060 #282828",
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    display: "flex",
                    marginTop: -2,
                    color: titleCount > 100 ? "red" : "#2c9af9",
                  }}
                >
                  Title (required)
                </label>

                <br />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "absolute",
                    bottom: 10,
                    right: 9,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  {titleCount}/{maxTitleChars}
                </div>

                <textarea
                  style={{
                    all: "unset",
                    width: "100%",
                    overflowY: "hidden",
                    overflowX: "hidden",
                    whiteSpace: "pre-wrap", // Preserve line breaks
                    wordWrap: "break-word",
                    minHeight: "100%",
                    display: "flex",
                    marginTop: -20,
                    position: "relative",
                    top: 1,
                    marginBottom: 16,
                    lineHeight: "auto",
                  }}
                  cols="auto"
                  rows="auto"
                  type="text"
                  // defaultValue={selectedFile?.video?.name || value}
                  value={title}
                  onChange={handleTitle}
                  onInput={(e) => {
                    const target = e.target;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                  title="Title (required)"
                />
              </div>

              {/* Description */}

              <div
                style={{
                  marginTop: 30,
                  border:
                    desCount > 5000 ? "1px solid red" : "1px solid #2c9af9",
                  width: 500,
                  borderRadius: 5,
                  position: "relative",
                  color: "white",
                  background: "#282828",
                  padding: 10,
                  overflowX: "hidden",
                  overflowY: "hidden",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#606060 #282828",
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    display: "flex",
                    marginTop: 0,
                    color: desCount > 5000 ? "red" : "#2c9af9",
                  }}
                >
                  Description (required)
                </label>

                <br />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "absolute",
                    bottom: 10,
                    right: 9,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  {desCount}/{maxDesChars}
                </div>

                <textarea
                  style={{
                    all: "unset",
                    width: "95%",
                    minHeight: 150,
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#606060 #282828",
                    whiteSpace: "pre-wrap", // Preserve line breaks
                    wordWrap: "break-word",
                    color: "white", // Text color
                    marginTop: -20,
                    marginBottom: 16,
                    padding: 10, // Added padding for better aesthetics
                    lineHeight: "1.5", // Adjust line-height as needed
                    borderRadius: 5, // Border radius
                  }}
                  cols="auto"
                  rows="auto"
                  type="text"
                  value={description}
                  onChange={handleDescription}
                  title="Description (required)"
                />
              </div>

              {/* Thumbnail */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBlock: 10,
                  marginLeft: 0,
                }}
              >
                {/* Rest of your component */}
                <h4 style={{ fontWeight: "500" }}>Thumbnail</h4>
                <h6
                  style={{
                    fontWeight: "500",
                    marginTop: -15,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Select or upload a picture that shows what's in your video. A
                  good thumbnail stands out and draws viewers' attention.
                </h6>

                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                  {thumbnail ? (
                    <>
                      <div
                        style={{
                          border:
                            selectedThumbnailIndex === -1
                              ? "2px solid white"
                              : "2px solid #282828",
                          boxSizing: "border-box", // Ensure border is included in width and height
                          borderRadius: 3,
                          position: "relative",
                          cursor: "pointer",
                          objectFit: "contain", // Maintain the aspect ratio of the image
                        }}
                        onClick={() => handleSelectedThumbnail(-1)}
                      >
                        <img
                          style={{
                            width: 130,
                            height: 70,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: 3,
                            objectFit: "contain", // Maintain the aspect ratio of the image
                          }}
                          src={URL.createObjectURL(thumbnail)}
                        />
                        {loading && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                              background: "rgba(1, 0, 0, 0.9)",
                              borderRadius: "3px",
                              zIndex: 2,
                            }}
                          >
                            Uploading...
                          </div>
                        )}

                        {/* change update thumbnail from gallery or download */}
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 4,
                            color: "white",
                          }}
                        >
                          <BsThreeDotsVertical
                            onClick={handleUpdateDeleteThumbnailToggle}
                            size={15}
                          />

                          {updateDownloadThumbnail && (
                            <div
                              style={{
                                borderRadius: 5,
                                width: 100,
                                height: 60,
                                background: "#1F1F1F",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                top: 0,
                                right: 14,
                              }}
                            >
                              <label
                                htmlFor="thumbnail"
                                style={{
                                  width: 100,
                                  height: 25,
                                  border: "none",
                                  marginTop: "10px",
                                  cursor: "pointer",
                                  color: "white",
                                  display: "flex",
                                  marginLeft: 10,
                                  fontSize: 12,
                                  gap: 10,
                                }}
                              >
                                {" "}
                                <RiImageAddFill size={18} />
                                Change
                                <input
                                  type="file"
                                  id="thumbnail"
                                  accept="image/*"
                                  onChange={(e) => (
                                    handleUpdateDeleteThumbnailToggle(e),
                                    handleThumbnailCreation(e)
                                  )}
                                  style={{ display: "none" }}
                                />
                              </label>
                              <button
                                onClick={handleDownloadThumbnail}
                                style={{
                                  width: 100,
                                  height: 25,
                                  background: "#1f1f1f",
                                  cursor: "pointer",
                                  border: "none",
                                  color: "white",
                                  display: "flex",
                                  fontSize: 12,
                                  gap: 10,
                                }}
                              >
                                {" "}
                                <MdFileDownload size={16} />
                                Download
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        width: 130,
                        height: 70,
                        border: "1px dotted white",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <label htmlFor="thumbnail">
                        <RiImageAddFill size={30} />
                        <p
                          style={{
                            fontWeight: "500",
                            fontSize: 12,
                            color: "gray",
                            marginTop: 1,
                            marginBottom: -10,
                          }}
                        >
                          Upload thumbnail
                        </p>
                        <input
                          type="file"
                          id="thumbnail"
                          accept="image/*"
                          onChange={handleThumbnailCreation}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  )}

                  {thumbnailsBlobs.map((canvasThumbnail, index) => (
                    <div
                      style={{
                        border:
                          selectedThumbnailIndex === index
                            ? "2px solid white"
                            : "2px solid #282828",
                        boxSizing: "border-box", // Ensure border is included in width and height
                      }}
                    >
                      <img
                        key={index}
                        onClick={() => handleSelectedThumbnail(index)}
                        style={{
                          cursor: "pointer",
                          filter:
                            selectedThumbnailIndex !== index && "blur(2px)", // Adjust the blur radius as needed
                          width: 130,
                          height: 70,
                          borderRadius: 3,
                        }}
                        src={URL.createObjectURL(canvasThumbnail)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </forms>

            {/* Selected Video */}
            <div
              style={{
                width: 300,
                height: 300,
                position: "sticky",
                left: 15,
                top: 80,
                right: 15,
                background: "#131215",
                borderRadius: 10,
              }}
            >
              <video
                ref={videoRef}
                style={{
                  marginTop: -10,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  objectFit: "fill", // Use 'cover' to maintain aspect ratio and cover the container
                }}
                width="300"
                height="171"
                controls
                poster={thumbnail}
              >
                <source
                  // src={URL.createObjectURL(selectedFile)}
                  src={selectedFile.blobUrl}
                  type={selectedFile?.type}
                />
                Your browser does not support the video tag.
              </video>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingInline: 10,
                }}
              >
                <h5
                  style={{ fontWeight: "400", color: "#979a9c", marginTop: 8 }}
                >
                  Video link
                </h5>
                <MdOutlineContentCopy
                  style={{ cursor: "pointer" }}
                  onClick={handleCopy}
                  size={25}
                />
              </div>
              <h4
                style={{
                  paddingLeft: 10,
                  color: "#11b6f5",
                  marginTop: -15,
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                {selectedFile.blobUrl.slice(0, 33)}...
              </h4>
              <h5
                style={{
                  paddingLeft: 10,
                  fontWeight: "400",
                  color: "#979a9c",
                  marginTop: 10,
                }}
              >
                FileName
              </h5>
              <h4
                style={{
                  paddingLeft: 10,
                  color: "#fff",
                  marginTop: -15,
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                {selectedFile?.video?.name &&
                selectedFile?.video?.name.length > 35
                  ? `${selectedFile?.video?.name.substring(0, 33)}...`
                  : selectedFile?.video?.name}
              </h4>
            </div>
          </div>

          <hr style={{ width: "99%", marginTop: 0 }} />
          <div
            style={{
              display: "flex",
              gap: 25,
              textAlign: "center",
              justifyContent: "space-between",
              alignItems: "center",
              paddingInline: 20,
              marginTop: -16,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <HiUpload color="#11b6f5" size={25} />
              <FcProcess color="#11b6f5" size={25} />
              <IoIosCheckmarkCircleOutline color="#11b6f5" size={25} />
              <li style={{ listStyle: "none", fontSize: 12 }}>
                Checks complete. No issues found.
              </li>
            </div>

            <div>
              <button
                onClick={handleUploadVideo}
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  fontWeight: "550",
                  color: "#000",
                  background: "#2c9af9",
                  paddingInline: 15,
                  paddingBlock: 10,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loading ? "PUBLISHING" : "NEXT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadFile;
