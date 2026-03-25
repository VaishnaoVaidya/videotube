import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../app.js";
import {Video} from "../models/video.model.js";

const toggleVideoLikeDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    try {
        // Find the existing like or dislike based on videoId, likedBy, and dislikedBy
        const existingLikeDislike = await Like.findOne({
            video: videoId,
            $or: [{ likedBy: userId }, { dislikedBy: userId }],
        });

        // If the like or dislike exists, toggle the status
        // If it doesn't exist, create a new one based on the user's action
        if (existingLikeDislike) {
            // if (existingLikeDislike === null) {
                if (existingLikeDislike === null ) {
                if (req.body.likedBy === userId.toString()) {
                    existingLikeDislike.likedBy = userId;
                }else {
                    if (req.body.dislikedBy === userId.toString()) {
                        existingLikeDislike.dislikedBy = userId;
                    }
                }
            } 

            console.log("Existing Like/Dislike found:", existingLikeDislike);
            console.log(
                "Existing Like/Dislike found:",
                existingLikeDislike.likedBy
            );
            console.log(
                "Type of existingLikeDislike.likedBy:",
                existingLikeDislike.likedBy &&
                    existingLikeDislike.likedBy.toString()
            );
            console.log("Type of userId:", typeof userId);

            if (
                existingLikeDislike.likedBy &&
                existingLikeDislike.likedBy.toString() === userId.toString()
            ) {
                console.log("User is already in likedBy, toggling off Like");
                if (req.body.likedBy) {
                    existingLikeDislike.likedBy = null;
                }

                if (req.body.dislikedBy) {
                    existingLikeDislike.dislikedBy = userId;
                    existingLikeDislike.likedBy = null;
                }
            } else if (
                existingLikeDislike.dislikedBy &&
                existingLikeDislike.dislikedBy.toString() === userId.toString()
            ) {
                console.log(
                    "User is already in dislikedBy, toggling off Dislike"
                );
                if (req.body.dislikedBy) {
                    existingLikeDislike.dislikedBy = null;
                }

                if (req.body.likedBy) {
                    existingLikeDislike.likedBy = userId;
                    existingLikeDislike.dislikedBy = null;
                }            } else {
                // Toggle between liking and disliking
                existingLikeDislike.likedBy = req.body.likedBy ? userId : null;
                existingLikeDislike.dislikedBy = req.body.dislikedBy
                    ? userId
                    : null;
            }

            await existingLikeDislike.save();

             // Remove the entire document if both likedBy and dislikedBy are null
             if (
                !existingLikeDislike.likedBy &&
                !existingLikeDislike.dislikedBy
            ) {
                await existingLikeDislike.deleteOne({ _id : existingLikeDislike._id})
            }
            console.log("Like/Dislike toggled:", existingLikeDislike);

             // After toggling the like or dislike, query the counts
        const likeCount = await Like.countDocuments({
            video: videoId,
            likedBy: { $ne: null },
        });
        const dislikeCount = await Like.countDocuments({
            video: videoId,
            dislikedBy: { $ne: null },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    liked: existingLikeDislike.likedBy === userId ? true : false,
                    disliked: existingLikeDislike.dislikedBy === userId ? true : false,
                    likeCount,
                    dislikeCount,
                },
                "Like/Dislike toggled successfully"
            )
        );

        } else {
            const newLikeDislike = new Like({
                video: videoId,
                likedBy: req.body.likedBy ? userId : null,
                dislikedBy: req.body.dislikedBy ? userId : null,
            });
            await newLikeDislike.save();

        // After toggling the like or dislike, query the counts
        const likeCount = await Like.countDocuments({
            video: videoId,
            likedBy: { $ne: null },
        });
        const dislikeCount = await Like.countDocuments({
            video: videoId,
            dislikedBy: { $ne: null },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                 {
                        liked: newLikeDislike.likedBy === userId ? true : false,
                        disliked: newLikeDislike.dislikedBy === userId ? true : false,
                        likeCount,
                        dislikeCount,
                    },
                "Like/Dislike toggled successfully"
            )
        );
    }

    } catch (error) {
        console.error("Error in toggleVideoLikeDislike:", error);

        let errorMessage = "Internal Server Error";
        if (error.name === "MongoError" && error.code === 11000) {
            errorMessage = "Duplicate like/dislike entry"; // Specific error for duplicate entries
        }

        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
});


const toggleCommentLikeDislike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        // Find the existing like or dislike based on videoId, likedBy, and dislikedBy
        const existingLikeDislike = await Like.findOne({
            comment: commentId,
            $or: [{ likedBy: userId }, { dislikedBy: userId }],
        });

        // If the like or dislike exists, toggle the status
        // If it doesn't exist, create a new one based on the user's action
        if (existingLikeDislike) {
            if (existingLikeDislike === null ) {
                if (req.body.likedBy === userId.toString()) {
                    existingLikeDislike.likedBy = userId;
                }else {
                    if (req.body.dislikedBy === userId.toString()) {
                        existingLikeDislike.dislikedBy = userId;
                    }
                }
            } 

            console.log("Existing Like/Dislike found 1:", existingLikeDislike);
            console.log(
                "Existing Like/Dislike found:",
                existingLikeDislike.likedBy
            );
            console.log(
                "Type of existingLikeDislike.likedBy:",
                existingLikeDislike.likedBy &&
                    existingLikeDislike.likedBy.toString()
            );
            console.log("Type of userId:", typeof userId);

            if (
                existingLikeDislike.likedBy &&
                existingLikeDislike.likedBy.toString() === userId.toString()
            ) {
                console.log("User is already in likedBy, toggling off Like");
                if (req.body.likedBy) {
                    existingLikeDislike.likedBy = null;
                }

                if (req.body.dislikedBy) {
                    existingLikeDislike.dislikedBy = userId;
                    existingLikeDislike.likedBy = null;
                }
            } else if (
                existingLikeDislike.dislikedBy &&
                existingLikeDislike.dislikedBy.toString() === userId.toString()
            ) {
                console.log(
                    "User is already in dislikedBy, toggling off Dislike"
                );
                if (req.body.dislikedBy) {
                    existingLikeDislike.dislikedBy = null;
                }

                if (req.body.likedBy) {
                    existingLikeDislike.likedBy = userId;
                    existingLikeDislike.dislikedBy = null;
                }            } else {
                // Toggle between liking and disliking
                existingLikeDislike.likedBy = req.body.likedBy ? userId : null;
                existingLikeDislike.dislikedBy = req.body.dislikedBy
                    ? userId
                    : null;
            }

            await existingLikeDislike.save();

             // Remove the entire document if both likedBy and dislikedBy are null
             if (
                !existingLikeDislike.likedBy &&
                !existingLikeDislike.dislikedBy
            ) {
                await existingLikeDislike.deleteOne({ _id : existingLikeDislike._id})
            }
            console.log("Like/Dislike toggled:", existingLikeDislike);

                // After toggling the like or dislike, query the counts
          const likeCount = await Like.countDocuments({
            comment: commentId,
            likedBy: { $ne: null },
        });
        const dislikeCount = await Like.countDocuments({
            comment: commentId,
            dislikedBy: { $ne: null },
        });

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        liked: existingLikeDislike.likedBy === userId ? true : false,
                        disliked: existingLikeDislike.dislikedBy === userId ? true : false,
                        likeCount,
                        dislikeCount,
                    },
                    "Like/Dislike toggled successfully"
                )
            );

        } else {
            const newLikeDislike = new Like({
                comment: commentId,
                likedBy: req.body.likedBy ? userId : null,
                dislikedBy: req.body.dislikedBy ? userId : null,
            });
            await newLikeDislike.save();
            console.log("newLikeDislike :", newLikeDislike);

          // After toggling the like or dislike, query the counts
          const likeCount = await Like.countDocuments({
            comment: commentId,
            likedBy: { $ne: null },
        });
        const dislikeCount = await Like.countDocuments({
            comment: commentId,
            dislikedBy: { $ne: null },
        });


         return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        liked: newLikeDislike.likedBy === userId ? true : false,
                        disliked: newLikeDislike.dislikedBy === userId ? true : false,
                        likeCount,
                        dislikeCount,
                    },
                    "Like/Dislike toggled successfully"
                )
            );
        
        
    }
 
    } catch (error) {
        console.error("Error in toggleVideoLikeDislike:", error);

        let errorMessage = "Internal Server Error";
        if (error.name === "MongoError" && error.code === 11000) {
            errorMessage = "Duplicate like/dislike entry"; // Specific error for duplicate entries
        }

        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId,
    }).populate("likedBy", "dislikedBy", "owner");

    if (existingLike) {
        await Like.findOneAndDelete({ _id: existingLike._id });
    } else {
        const newLike = new Like({
            tweet: tweetId,
            likedBy: userId,
        });
        await newLike.save();
    }

    // After toggling the like, query the like count
    const likeCount = await Like.countDocuments({ tweet: tweetId });

    console.log(likeCount);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { liked: !existingLike, likeCount },
                "Like toggled successfully"
            )
        );
});

const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        return res.status(400).json({
            success: false,
            message: "No videoId provided in the URL parameters.",
        });
    }

    try {
        const likes = await Like.find({ video: videoId }).populate({
            path: "video",
            select: "tweet comment likedBy dislikedBy",
        });
        return res.status(200).json({
            success: true,
            data: likes,
            message: "Likes and dislikes fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching likes:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

const getAllCommentLikes = asyncHandler(async (req, res) => {
    try {
        const commentLikes = await Like.find({ comment: { $exists: true } })
        .populate({
          path: 'comment',
          select: 'video tweet comment', // Replace with actual fields in your Comment model
        })
        .populate({
          path: 'likedBy dislikedBy',
          model: 'User', // Replace with the actual model name for users
          select: 'username email', // Replace with actual fields you want to retrieve
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    commentLikes,
                },
                'All comment likes fetched successfully'            )
        );
      
    } catch (error) {
        console.error("Error fetching comment likes:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

const getTweetLikes = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        return res.status(400).json({
            success: false,
            message: "No tweetId provided in the URL parameters.",
        });
    }

    try {
        const likes = await Like.find({ video: videoId }).populate({
            path: "tweet",
            select: "vide comment likedBy dislikedBy",
        });

        return res.status(200).json({
            success: true,
            data: likes,
            message: "Tweet likes and dislikes fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching tweet likes:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

const getLikedVideos = asyncHandler (async(req, res)=> {
    // const userId = req.user._id;
    try {
        const {userId} = req.params
        
        const likedVideos = await Like.find({likedBy : userId}).populate("video").select(" -comment")
        console.log("likedVideos: " + likedVideos);
    
        return res.status(200).json({
            success: true,
            data: likedVideos,
            message: "likedVideos fetched successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(new ApiError(error.message));
    }
})

export {
    toggleVideoLikeDislike,
    toggleCommentLikeDislike,
    toggleTweetLike,
    getAllCommentLikes,
    getVideoLikes,
    getTweetLikes,
    getLikedVideos
};
