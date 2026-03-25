import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);

  const [videoStats] = await Video.aggregate([
    { $match: { owner: ownerId } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const [likeStats] = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoData",
      },
    },
    { $unwind: "$videoData" },
    { $match: { "videoData.owner": ownerId, likedBy: { $ne: null } } },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: 1 },
      },
    },
  ]);

  const [commentStats] = await Comment.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoData",
      },
    },
    { $unwind: "$videoData" },
    { $match: { "videoData.owner": ownerId } },
    {
      $group: {
        _id: null,
        totalComments: { $sum: 1 },
      },
    },
  ]);

  const currentUser = await User.findById(req.user._id).select("watchHistory fullName username email");

  const topVideos = await Video.aggregate([
    { $match: { owner: ownerId } },
    {
      $lookup: {
        from: "likes",
        let: { videoId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$video", "$$videoId"] }, { $ne: ["$likedBy", null] }],
              },
            },
          },
        ],
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
        score: {
          $add: [
            "$views",
            { $multiply: [{ $size: "$likes" }, 3] },
            { $multiply: [{ $size: "$comments" }, 2] },
          ],
        },
      },
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 5 },
    {
      $project: {
        title: 1,
        views: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
        score: 1,
      },
    },
  ]);

  const monthlyPerformance = await Video.aggregate([
    { $match: { owner: ownerId } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        uploads: { $sum: 1 },
        views: { $sum: "$views" },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 6 },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        overview: {
          totalVideos: videoStats?.totalVideos || 0,
          totalViews: videoStats?.totalViews || 0,
          totalLikes: likeStats?.totalLikes || 0,
          totalComments: commentStats?.totalComments || 0,
          watchCount: currentUser?.watchHistory?.length || 0,
        },
        profile: {
          fullName: currentUser?.fullName || "",
          username: currentUser?.username || "",
          email: currentUser?.email || "",
        },
        topVideos,
        monthlyPerformance,
      },
      "Dashboard stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate("owner", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
