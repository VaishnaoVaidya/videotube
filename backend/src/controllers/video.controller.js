import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const retrieveVideosFromDB = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate("owner");

    return res.status(200).json(
      new ApiResponse(
        200,
        videos,
        "All videos fetched successfully"
      )
    );
  } catch (error) {
    // Handle errors appropriately (e.g., send an error response)
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { createdAt } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const filter = { owner: userId }; // Changed userId to owner

    // Add filter for createdAt if provided in query parameters
    if (createdAt) {
      filter.createdAt = { $gte: new Date(createdAt) }; // Assuming createdAt is a date or date string
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 }).populate("owner");

    return res.status(200).json(
      new ApiResponse(
        200,
       videos,
        "All videos fetched successfully"
      )
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



const publishVideo = asyncHandler(async (req, res) => {
  //video
  //upload to cloudinary
  //save as url from cloudinary in mongodb

  // const user = await req.user._id
  // console.log(user);

  try {
    const { title, description } = req.body;
  
    if (!title) {
      throw new ApiError(401, "Please enter title");
    }
  
    console.log("videoFileLocalPath:", req.files?.videoFile);
    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    let thumbnailLocalPath;
  
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailLocalPath = req.files.thumbnail[0].path;
    }
  
    if (!videoFileLocalPath) {
      throw new ApiError(402, "Please add video file");
    }
  
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  
    console.log("videoFile", videoFile.duration);
  
    if (!videoFile) {
      throw new ApiError(500, "file not uploaded on database");
    }
  
    const video = await Video.create({
      videoFile : videoFile.url,
      thumbnail : thumbnail?.url || "",
      title,
      description,
      owner: req.user._id
    });

    const createdVideo = await Video.findById(video._id).populate("owner");
  
    return res
      .status(200)
      .json(new ApiResponse(200, createdVideo, "Video created successfully"));
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});


const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate("owner")
  // console.log(video);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  console.log("video", video.videoFile.duration);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video created successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(401, "Thumbnail file is missing");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  console.log(thumbnail);

  const updatedDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        "thumbnail.url": thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDetails, "updated details successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "deleted Video successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { isPublished } = req.body;

  const togglePublish = await Video.findByIdAndUpdate(videoId);

  if (!togglePublish) {
    throw new ApiError(404, "Video not found");
  }

  togglePublish.isPublished = !togglePublish.isPublished;

  const toggle = await togglePublish.save();

  return res
    .status(200)
    .json(new ApiResponse(200, toggle, "deleted Video successfully"));
});

export {
  publishVideo,
  getVideoById,
  getAllVideos,
  deleteVideo,
  togglePublishStatus,
  updateVideo,
  retrieveVideosFromDB
};
