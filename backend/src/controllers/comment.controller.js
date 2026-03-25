import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {Like} from "../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    console.log("Video ID:", videoId);
    const { page = 1, limit = 20 } = req.query;

    try {

        // const commentLikes = await Like.find({commentId})

        const getComment = await Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId),
                },
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                },
            },
            {
                $unwind: "$video",
            },
            {
                $unwind: "$owner",
            },
            {
                $group: {
                    _id: "$video._id",
                    video: { $first: "$video" },
                    owner: { $first: "$owner" },
                    comments: { $push: "$$ROOT" }, // Add all comment details to the "comments" array
                    commentsCount: { $sum: 1 }, // Count of comments
                },
            },
        ])
            .skip((page - 1) * limit)
            .limit(Number(limit));

        console.log("Result:", getComment);

        // if (!getComment.length) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "No comments found for the specified video",
        //     });
        // }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    getComment,
                    "User comments fetched successfully"
                )
            );
    } catch (error) {
        // Handle errors and provide a meaningful response
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(404, "please add content to proceed");
    }

    const addComment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id,
    });

    console.log(addComment);

    return res
        .status(200)
        .json(new ApiResponse(200, addComment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // TODO: add a comment to a video
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(404, "please add content to proceed");
    }

    try {
        console.log("Received commentId:", commentId);

        const updateComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content: content,
                },
            },
            {
                new: true,
            }
        );

        console.log("updateComment", updateComment);

        if (!updateComment) {
            console.log("Comment not found in the database.");
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Comment not found"));
        }

        console.log("updateComment", updateComment);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updateComment,
                    "Comment updated successfully"
                )
            );
    } catch (error) {
        console.error("Error updating comment:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Internal server error"));
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    const deleteComment = await Comment.findByIdAndDelete(commentId);
    const deleteLikes = await Like.deleteMany({ comment: commentId });

    console.log(deleteComment);

    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteComment,deleteLikes, "comment deleted successfully")
        );
});

export { getVideoComments, addComment, updateComment, deleteComment };
