import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineOutlinedFlag } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

const Comments = () => {
  // Inside your component
  const [commentEditionKey, setCommentEditionKey] = useState(0);

  const { videoId } = useParams();
  const currentCommentId = useRef(null);
  const host = "http://localhost:8000/api/v1";

  const { userProfile } = useContext(UserContext);
  // console.log("userProfile comment :" + JSON.stringify(userProfile._id));

  const [addComment, setAddComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoComments, setVideoComments] = useState([]);
  const [displayButtons, setDisplayButtons] = useState(false);

  //update delete toggle HiOutlineDotsVertical
  const [updateDeleteComment, setUpdateDeleteComment] = useState({});

  const [confirmDeletion, setConfirmDeletion] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  const [editionLoading, setEditionLoading] = useState({});
  const [editedComment, setEditedComment] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const [reportComment, setReportComment] = useState({});
  // console.log("updateDeleteComment:", updateDeleteComment);
  // console.log("reportComment:", reportComment);

  //like dislike comment
  const [commentLikeStatus, setCommentLikeStatus] = useState([]);
  const [commentLikesCount, setCommentLikesCount] = useState(0);
  const [commentDislikeStatus, setCommentDislikeStatus] = useState([]);

  const [likesArray, setLikesArray] = useState([]);

  // console.log("userProfile for comments", userProfile._id);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDisplayButtons(false);

    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${host}/comments/${videoId}`,
        {
          content: addComment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Fetch the updated comments for the video
      const updatedCommentsResponse = await axios.get(
        `${host}/comments/${videoId}`
      );

      // Update the state with the new comments
      setVideoComments(updatedCommentsResponse.data.comments);

      // console.log("Comment added successfully:", response.data);
    } catch (error) {
      // console.log("Comment error", error.message);
    } finally {
      setLoading(false);
      setAddComment("");
      setDisplayButtons(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/comments/${videoId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const likesResponse = await axios.get(`${host}/likes/comments`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userId = userProfile._id;
        // Assuming likeDislikeArray contains an array of comments with their like and dislike statuses
        const likeDislikeArray = likesResponse.data.data.commentLikes;

        // Extract and set like and dislike statuses for each comment
        const updatedLikeStatus = {};
        const updatedDislikeStatus = {}; // New object to store dislike statuses
        const totalLikesCountMap = {};

        likeDislikeArray.forEach((comment) => {
          const commentId = comment.comment._id;
          const hasLiked = comment.likedBy && comment.likedBy._id === userId; // Check if the comment has been liked
          const hasDisliked =
            comment.dislikedBy && comment.dislikedBy._id === userId; // Check if the comment has been disliked
          // Update the state with the like and dislike statuses for the comment
          updatedLikeStatus[commentId] = {
            liked: hasLiked,
          };

          // Update the state with the dislike status for the comment
          updatedDislikeStatus[commentId] = {
            disliked: hasDisliked,
          };

           // Extract commentId and likedBy from the comment object
  const { likedBy } = comment;

  // Check if likedBy is not null and is an object
  if (likedBy && typeof likedBy === 'object') {
    // Count the number of likes for the current comment
    const totalLikesCount = Object.keys(likedBy).length;

    // Update the totalLikesCountMap with the count for the current commentId
    totalLikesCountMap[commentId] = totalLikesCount;
  } else {
    // If likedBy is null or not an object, set the total likes count to 0
    totalLikesCountMap[commentId] = 0;
  }
          // Calculate total likes count for the comment
          const totalLikesCount = comment.likedBy !== null ? comment?.likedBy?.length : 0;

  // Update the state with the total likes count for the comment
  // console.log("totalLikesCountMap: ", totalLikesCountMap);
  // console.log("updatedTotalLikesCount length: ", totalLikesCount);


 
        });

        // Update the state with the new like and dislike statuses for all comments
        setCommentLikeStatus(updatedLikeStatus);
        setCommentDislikeStatus(updatedDislikeStatus); // Set dislike status
         // Set the total likes count state
  setCommentLikesCount(totalLikesCountMap);

        // console.log("Comments details fetched:", response.data.data);
        // console.log("Comments Likes fetched:", likeDislikeArray);
        // console.log("User profile ID:", userId);
        // console.log("Total Likes Count:", totalLikesCount);

        if (response.statusCode === 404) {
          return;
        }

        setVideoComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };

    fetchComments();
  }, [
    userProfile,
    videoId,
    confirmDeletion,
    editionLoading,
    editedComment,
  ]);

  const handleToggleLike = async (commentId) => {
    // const { _id: commentId } = comment;
    const userId = userProfile._id;
    // console.log("handleToggleLike for comment userId: " + userId);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // Send the like/dislike status to the server
      const response = await axios.post(
        `${host}/likes/toggle/comment/${commentId}`,
        {
          likedBy: userId,
          dislikedBy: null, // Reset dislike when liking
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const likeCount = response.data.data.likeCount;
      const liked = response.data.data.liked;

      // Update state with new like status and count
      // Update state with new like status and count
      setCommentLikeStatus((prevStatus) => ({
        ...prevStatus,
        [commentId]: liked,
      }));
      setCommentLikesCount(likeCount);
      // setVideoLikesCount((prevCount) => prevCount + 1);

      // console.log("comment like response: ", response.data);
      // console.log("comment liked:", response.data.data.liked);
      // console.log("Video likes count:", response.data.data.likeCount);
    } catch (error) {
      console.log("Toggle comment Like error", error.message);
    }
  };

  const handleToggleDislike = async (commentId) => {
    // const { _id: commentId } = comment;
    const userId = userProfile._id;
    // console.log("handleToggleLike comment userId: " + userId);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // Send the like/dislike status to the server
      const response = await axios.post(
        `${host}/likes/toggle/comment/${commentId}`,
        {
          dislikedBy: userId,
          likedBy: null, // Reset dislike when liking
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const disliked = response.data.data.disliked;

      setCommentDislikeStatus((prevStatus) => ({
        ...prevStatus,
        [commentId]: disliked,
      })); // setVideoLikesCount((prevCount) => Math.max(0, prevCount - 1));

      // console.log("comment dislike response: ", response.data);
      // console.log("comment disliked:", response.data.data.disliked);
      // console.log("comment disliked count:", response.data.data.likeCount);
    } catch (error) {
      console.log("Toggle Video Like error", error.message);
    }
  };

  useEffect(() => {
    if (addComment.length > 0) {
      setDisplayButtons(true);
    }
  }, [addComment]);

  const handleCancel = (e) => {
    e.preventDefault();
    setAddComment("");
    setDisplayButtons(false);
  };

  // delete or edit comment

  const handleToggleCommentEdition = (comment) => {
    const {
      _id: commentId,
      owner: { _id: commentOwnerId },
    } = comment;

    // // console.log("Comment ID:", commentId);
    // // console.log("Owner ID:", commentOwnerId);

    const userProfileId = userProfile._id;
    // // console.log("User Profile ID:", userProfileId);
    // // console.log("currentCommentId.current:", currentCommentId);
    // Reset all comments to false if a different comment is clicked
    if (commentId !== currentCommentId.current) {
      setUpdateDeleteComment({});
      setReportComment({});
      currentCommentId.current = commentId;
      setCommentEditionKey((prevKey) => prevKey + 1); // Change the key
    }

    if (userProfileId === commentOwnerId) {
      setUpdateDeleteComment((prevOptions) => {
        const newOptions = { ...prevOptions };
        newOptions[commentId] = !newOptions[commentId];
        // console.log("updateDeleteComment:", newOptions);
        return newOptions;
      });
    } else {
      // setUpdateDeleteComment({});
      // setReportComment({});
      setReportComment((prevOptions) => {
        const newOptions = { ...prevOptions };
        newOptions[commentId] = !newOptions[commentId];
        // console.log("reportComment:", newOptions);
        return newOptions;
      });
    }
  };

  // Check if the clicked element is outside the comment edition area

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is outside the comment edition area
      if (!event.target.closest("#editDeleteButtons")) {
        setUpdateDeleteComment({});
        setReportComment({});
        setConfirmDeletion(null);
      }
    };

    // Add a click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCancelEdit = () => {
    // Clear the edited comment state and deselect the comment
    setEditedComment({});
    setSelectedCommentId(null);
  };

  const handleSaveEditedComment = async (comment) => {
    const { _id: commentId } = comment;
    setEditionLoading((prevLoading) => ({
      ...prevLoading,
      [commentId]: true,
    }));

    const accessToken = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `${host}/comments/c/${commentId}`,
        {
          content: editedComment[commentId], // Assuming editedComment is an object with commentId as keys
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log("Comment updated successfully!");
    } catch (error) {
      // console.log("Updating Comment error", error.message);
    } finally {
      // Reset the state or perform any necessary cleanup
      setEditedComment({});
      setSelectedCommentId(null);
      setEditionLoading((preLoading) => ({
        ...preLoading,
        [commentId]: false,
      }));
    }
  };

  const handleDeleteComment = async (e, commentId) => {
    e.preventDefault();

    setDeleteLoading((prevLoading) => ({
      ...prevLoading,
      [commentId]: true,
    }));

    // Handle delete
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.delete(`${host}/comments/c/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("Delete comment id:", response.data);
    } catch (error) {
      // console.log("Deteting Comment error", error.message);
    } finally {
      setConfirmDeletion(null);
      setDeleteLoading((preLoading) => ({
        ...preLoading,
        [commentId]: false,
      }));
    }
  };

  return (
    <div style={{ flex: 1, width: "100%" }}>
      <h1>
        {" "}
        {videoComments && videoComments[0]?.commentsCount}{" "}
        {videoComments[0]?.commentsCount.length === (0 || 1)
          ? " Comment"
          : " Comments"}
      </h1>

      {/* add comments */}
      {loading ? (
        <div
          style={{
            width: "98%",
            display: "flex",
            gap: 10,
          }}
        >
          <hr
            style={{
              width: 30,
              border: "3px solid gray" /* Light grey */,
              borderBottom: "3px solid #000" /* Blue */,
              borderRadius: "50%",
              height: 30,
              animation: "spin 1.5s linear infinite", // Use the loading animation
            }}
          />
          <style>
            {`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
          
        }
      `}
          </style>
        </div>
      ) : (
        <form
          style={{
            width: "98%",
            display: "flex",
            gap: 10,
          }}
        >
          {userProfile ? (
            <img
              src={userProfile.avatar}
              alt=""
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
              }}
            />
          ) : (
            <img src="images/unknown.png" alt="" />
          )}

          <div
            style={{
              all: "unset",
              width: "100%",
              height: "auto",
            }}
          >
            <textarea
              id="addComment"
              placeholder="Add a comment..."
              rows={1}
              value={addComment}
              onChange={(txt) => setAddComment(txt.target.value)}
              onInput={(e) => {
                const target = e.target;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              onFocus={(e) => (e.target.style.borderBottom = "2px solid white")}
              onBlur={(e) => (e.target.style.borderBottom = "thin solid gray")}
              style={{
                all: "unset",
                overflow: "hidden",
                paddingBottom: 4, // Adjust the value as needed
                wordBreak: "break-all",
                whiteSpace: "pre-wrap", // Prevent text from wrapping
                borderBottom: "thin solid gray",
                width: "100%",
                minHeight: 10,
              }}
            />
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 20,
                  marginRight: 10,
                  marginTop: 10,
                  display: displayButtons === false ? "none" : "flex",
                }}
              >
                <button
                  onClick={handleCancel}
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: "rgb(15, 15, 15)",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  style={{
                    border: "1px solid #000",
                    cursor: "pointer",
                    paddingInline: 4,
                    paddingBlock: 10,
                    width: 100,
                    height: 38,
                    backgroundColor:
                      addComment?.length > 0 ? "rgb(41 162 230)" : "#272727",
                    color: addComment?.length > 0 ? "#000" : "#aaaaaa",
                    borderRadius: 25,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Comment
                </button>
              </div>
            </>
          </div>
        </form>
      )}

      {/* videos all comments  */}
      <div style={{ marginTop: 15, width: "96%" }}>
        {videoComments[0]?.comments.map((comment, index) => {
          // // console.log("createdAt:", comment?.createdAt);
          // // console.log("Time Ago:", formatDistanceToNow(new Date(comment?.createdAt)));

          const commentLikesCount = likesArray.filter(
            (like) =>
              like.comment && like.comment._id === comment._id && like.likedBy
          ).length;

          return (
            <div
              key={comment._id}
              ref={currentCommentId}
              // onMouseOver={() => handleMouseOver(comment._id)}
              // onMouseOut={handleMouseOut}
              style={{
                marginTop: 15,
                display: "flex",
                flexDirection: "row",
                position: "relative",
              }}
            >
              {selectedCommentId === comment._id ? (
                // Render the textarea for editing the selected comment
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <form
                    style={{
                      width: "98%",
                      display: "flex",
                      gap: 10,
                      marginBottom: 30,
                      marginTop: 5,
                    }}
                  >
                    {userProfile ? (
                      <img
                        src={userProfile.avatar}
                        alt=""
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <img src="images/unknown.png" alt="" />
                    )}

                    <div
                      style={{
                        all: "unset",
                        width: "100%",
                        minHeight: "100%",
                      }}
                    >
                      <textarea
                        id="addComment"
                        placeholder="Add a comment..."
                        value={editedComment[comment._id] || comment.content}
                        onChange={(e) => {
                          const newText = e.target.value;
                          setEditedComment((prevEditedComment) => ({
                            ...prevEditedComment,
                            [comment._id]: newText,
                          }));
                        }}
                        onInput={(e) => {
                          const target = e.target;
                          target.style.height = "auto";
                          target.style.height = `${Math.max(
                            target.scrollHeight,
                            40
                          )}px`;

                          // Calculate the number of rows based on the content
                          const numLines = target.value.split("\n").length;
                          target.rows = numLines; // Set a minimum of 2 rows
                        }}
                        rows={"auto"} // Set a minimum of 2 rows
                        onFocus={(e) =>
                          (e.target.style.borderBottom = "2px solid white")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderBottom = "thin solid gray")
                        }
                        style={{
                          all: "unset",
                          overflow: "hidden",
                          paddingBottom: 4,
                          wordBreak: "break-all",
                          whiteSpace: "pre-wrap",
                          borderBottom: "thin solid gray",
                          width: "100%",
                          minHeight: 10, // Change to a number
                        }}
                      />

                      <div
                        style={{
                          justifyContent: "flex-end",
                          gap: 20,
                          marginRight: 10,
                          marginTop: 10,
                          display: "flex",
                        }}
                      >
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            color: "#fff",
                            cursor: "pointer",
                            border: "none",
                            backgroundColor: "rgb(15, 15, 15)",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button" // Change the type to "button" if it's inside a form
                          onClick={() => handleSaveEditedComment(comment)}
                          disabled={
                            comment.content === editedComment[comment._id]
                          }
                          style={{
                            border: "1px solid #000",
                            cursor: "pointer",
                            paddingInline: 4,
                            paddingBlock: 10,
                            marginRight: 0,
                            width: 70,
                            height: 38,
                            backgroundColor:
                              comment.content !== editedComment[comment._id]
                                ? "rgb(41 162 230)"
                                : "#272727",
                            color:
                              comment.content !== editedComment[comment._id]
                                ? "#000"
                                : "#aaaaaa",
                            borderRadius: 25,
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>

                  <div
                    style={{
                      flex: 1,
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {editionLoading[comment._id] && (
                      <div
                        style={{
                          flex: 1,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <hr
                          style={{
                            width: 30,
                            border: "3px solid gray" /* Light grey */,
                            borderBottom: "3px solid #000" /* Blue */,
                            borderRadius: "50%",
                            height: 30,
                            animation: "spin 1.5s linear infinite", // Use the loading animation
                          }}
                        />
                        <style>
                          {`
                                @keyframes spin {
                                  0% {
                                    transform: rotate(0deg);
                                  }
                                  50% {
                                    transform: rotate(180deg);
                                  }
                                  100% {
                                    transform: rotate(360deg);
                                  }
                                  
                                }
                             `}
                        </style>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "98%",
                      display: "flex",
                    }}
                  >
                    <img
                      src={comment?.owner?.avatar}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        padding: 1,
                        alignItems: "flex-start",
                        marginTop: 9,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          paddingLeft: 10,
                          alignItems: "flex-start",
                          color: "white",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            marginTop: -10,
                            textDecoration: "none",
                            color: "white",
                          }}
                        >
                          {"@"}
                          {comment?.owner?.username}{" "}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: "400",
                              marginTop: -10,
                              textDecoration: "none",
                              color: "#aaaaaa",
                            }}
                          >
                            {formatDistanceToNow(new Date(comment?.createdAt))}{" "}
                            ago
                          </span>
                        </p>

                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            marginTop: 0,
                            width: "95%",
                            textDecoration: "none",
                            color: "#fff",
                          }}
                        >
                          {comment?.content}
                        </p>

                        {/* toggle comment like */}

                        <div style={{ display: "flex", paddingTop: 7 }}>
                          <button
                            onClick={() => handleToggleLike(comment._id)}
                            style={{
                              cursor: "pointer",
                              background: "#272727",
                              padding: 4,
                              width: 32,
                              height: 32,
                              color: "white",
                              borderRadius: "50%",
                            }}
                          >
                            {commentLikeStatus &&
                              (commentLikeStatus[comment._id] &&
                              commentLikeStatus[comment._id].liked ? (
                                <BiSolidLike size={22} />
                              ) : (
                                <BiLike size={22} />
                              ))}
                          </button>

                          <span
                            style={{
                              fontSize: 10,
                              display: "flex",
                              paddingTop: 4,
                              marginRight: 4,
                              color: "#AAAAAA",
                              fontWeight: "500",
                              height: 30,
                            }}
                          >
                            {/* {commentLikesCount && commentLikesCount[comment._id]} */}
                          </span>
                          <button
                            onClick={() => handleToggleDislike(comment._id)}
                            style={{
                              cursor: "pointer",
                              background: "#272727",
                              padding: 3,
                              width: 32,
                              height: 32,
                              color: "white",
                              borderRadius: "50%",
                            }}
                          >
                            {commentDislikeStatus &&
                              (commentDislikeStatus[comment._id] &&
                              commentDislikeStatus[comment._id].disliked ? (
                                <BiSolidDislike size={22} />
                              ) : (
                                <BiDislike size={22} />
                              ))}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* comment edition */}
                    <div
                      style={{
                        display: "flex",
                        position: "absolute",
                        right: 10,
                        top: 5,
                      }}
                      onClick={() => handleToggleCommentEdition(comment)}
                    >
                      <HiOutlineDotsVertical
                        id="editDeleteButtons" // Add the id here
                        //  use this if using other than jsx tag like this use fo\r ******** HiOutlineDotsVertical******
                        // onClick={(event) => {
                        //   const commentId =
                        //     event.currentTarget.getAttribute("data-comment-id");
                        //   const ownerId =
                        //     event.currentTarget.getAttribute("data-owner-id");

                        //   if (commentId && ownerId) {
                        //     // console.log("Clicked CommentId:", commentId);
                        //     // console.log("Clicked OwnerId:", ownerId);
                        //     handleToggleCommentEdition(commentId, ownerId);
                        //   }
                        // }}
                        // data-comment-id={comment._id}
                        // data-owner-id={comment.owner._id}
                        style={{ cursor: "pointer" }}
                        size={20}
                      />

                      {/* edit or delete comment options */}
                      {updateDeleteComment[comment._id] && (
                        <div
                          id="editDeleteButtons"
                          style={{
                            borderRadius: 15,
                            width: 120,
                            height: 90,
                            background: "#282828",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 25,
                            right: -90,
                            zIndex: 999,
                            gap: 15,
                          }}
                        >
                          <button
                            onClick={() => setSelectedCommentId(comment._id)}
                            style={{
                              width: "100%",
                              height: 25,
                              border: "none",
                              background: "#282828",
                              paddingTop: "10px",
                              paddingLeft: 20,
                              cursor: "pointer",
                              color: "white",
                              display: "flex",
                              textAlign: "center",
                              gap: 15,
                              fontSize: 14,
                              fontWeight: "500",
                            }}
                          >
                            {" "}
                            <MdOutlineEdit size={20} />
                            Edit
                          </button>

                          <button
                            onClick={() => setConfirmDeletion(comment._id)}
                            style={{
                              width: 100,
                              height: 25,
                              paddingLeft: 7,
                              background: "#282828",
                              cursor: "pointer",
                              textAlign: "center",

                              border: "none",
                              color: "white",
                              display: "flex",
                              gap: 15,
                              fontSize: 14,
                              fontWeight: "500",
                            }}
                          >
                            {" "}
                            <RiDeleteBin6Line size={20} />
                            Delete
                          </button>
                        </div>
                      )}

                      {/* edition of particular comment */}

                      {/* confirm deletion */}

                      {confirmDeletion && (
                        <div
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 260,
                            height: 170,
                            background: "#1f1f1f",
                            zIndex: 1002,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 15,
                          }}
                        >
                          <div
                            style={{
                              textAlign: "start",
                              width: "100%",
                              marginTop: 10,
                              marginLeft: 30,
                            }}
                          >
                            <h5
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                                color: "#ffffff",
                              }}
                            >
                              Delete comment
                            </h5>
                            <h6
                              style={{
                                color: "#ffffff",
                                marginBottom: 20,
                                fontSize: 12,
                                color: "#10101",
                                fontWeight: "400",
                                marginTop: -3,
                              }}
                            >
                              Delete your comment permanently
                            </h6>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              width: "100%",
                              marginRight: 20,
                              fontSize: 16,
                              fontWeight: "bold",
                              marginBottom: 20,
                            }}
                          >
                            <button
                              onClick={() => setConfirmDeletion(null)}
                              style={{
                                background: "none",
                                color: "rgb(62,166,255)",
                                fontSize: 14,
                                fontWeight: "500",
                                cursor: "pointer",
                                marginRight: 10,
                                border: "none",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteComment(e, confirmDeletion)
                              }
                              style={{
                                background: "none",
                                color: "rgb(62,166,255)",
                                fontSize: 14,
                                fontWeight: "500",
                                cursor: "pointer",
                                border: "none",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}

                      {/* report comment options */}

                      {reportComment[comment._id] && (
                        <div
                          style={{
                            borderRadius: 15,
                            width: 140,
                            height: 50,
                            background: "#282828",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 25,
                            right: -90,
                            zIndex: 999,
                            gap: 15,
                          }}
                        >
                          <button
                            style={{
                              height: 25,
                              border: "none",
                              background: "#282828",
                              paddingTop: 4,
                              paddingLeft: 10,
                              cursor: "pointer",
                              color: "white",
                              display: "flex",
                              textAlign: "center",
                              gap: 15,
                              fontSize: 14,
                              fontWeight: "500",
                            }}
                          >
                            {" "}
                            <MdOutlineOutlinedFlag size={20} />
                            Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {deleteLoading[comment._id] && (
                      <div
                        style={{
                          flex: 1,
                          minWidth: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <hr
                          style={{
                            width: 30,
                            border: "3px solid gray" /* Light grey */,
                            borderBottom: "3px solid #000" /* Blue */,
                            borderRadius: "50%",
                            height: 30,
                            animation: "spin 1.5s linear infinite", // Use the loading animation
                          }}
                        />
                        <style>
                          {`
                                @keyframes spin {
                                  0% {
                                    transform: rotate(0deg);
                                  }
                                  50% {
                                    transform: rotate(180deg);
                                  }
                                  100% {
                                    transform: rotate(360deg);
                                  }
                                  
                                }
                             `}
                        </style>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
