import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const isBlank = (value) =>
  typeof value !== "string" || value.trim().length === 0;

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details frontend
  //validation - not empty
  //check if user already exists: username , email, phone
  //check for images , check for avtar
  //upload them to cloudniary, avatar
  //create user object - vreate entry in db
  //remove password and refresh token field from response
  //chcek for user creation
  //return res

  const { username, fullName, password, email } = req.body;
  console.log("INFO: ", email, username, fullName, password);

  if (
    [username, fullName, password, email].some((field) => field?.trim === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // if(!typeof phoneNumber === Number){
  //     console.log( typeof phoneNumber);
  //     throw new ApiError(400, "Phone Number must be a number")
  // }

  if (!email.includes("@gmail.com")) {
    throw new ApiError(400, "Invalid email address");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  //   console.log(req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const userCreated = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered Successfully"));
});

const signUpUser = asyncHandler(async (req, res) => {
  // get user details frontend
  //validation - not empty
  //check if user already exists: username , email, phone
  //check for images , check for avtar
  //upload them to cloudniary, avatar
  //create user object - vreate entry in db
  //remove password and refresh token field from response
  //chcek for user creation
  //return res

  const { username, password, email } = req.body;
  console.log("INFO: ", email, username, password);

  if ([username, password, email].some(isBlank)) {
    throw new ApiError(400, "All fields are required");
  }

  // if(!typeof phoneNumber === Number){
  //     console.log( typeof phoneNumber);
  //     throw new ApiError(400, "Phone Number must be a number")
  // }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email address");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }


  const user = await User.create({
    email: email.trim().toLowerCase(),
    password,
    username: username.trim().toLowerCase(),
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username or email
  //find user
  //password check
  //access and refresh token
  //send cookie

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const getAccessToken = req.cookies.accessToken

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken //req.body to get refresh token from mobile browser

    // console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
 

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});


const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!(newPassword === confirmPassword)) {
    throw new ApiError(401, "new password must match confirm password");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  if (newPassword === oldPassword) {
    throw new ApiError(401, "New password should not match old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "password updated"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const accessToken = req.cookies.accessToken

   
  const user = await User.aggregate([
    {
      $match: {
        _id: userId,
      }
    },
    {
      $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup:{
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos"
      }
    },
    {
      $addFields:{
        subscribersCount: {
          $size: "$subscribers"
        },
        subscribedChannels : {
          $size: "$subscribedTo"
        },
        totalVideos: {
            $size: "$videos"
        }
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscribedChannels: 1,
        totalVideos: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        bio: 1,
      }
    }

  ])
  return res
    .status(200)
    .json(
      new ApiResponse(200, {user,accessToken}, "current user fetched successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username, bio } = req.body;

  if (email && email !== req.user?.email) {
    throw new ApiError(401,"sorry you can't change email  update")
  }

  const updates = {};

  if (typeof fullName === "string") {
    updates.fullName = fullName.trim();
  }

  if (typeof bio === "string") {
    updates.bio = bio.trim();
  }

  if (typeof username === "string") {
    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername) {
      throw new ApiError(400, "Username cannot be empty");
    }

    const existingUser = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: req.user?._id },
    });

    if (existingUser) {
      throw new ApiError(409, "Username already exists");
    }

    updates.username = normalizedUsername;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updates,
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updates successfully"));
});


const updateUserAvatar = asyncHandler(async (req, res) => {

  const avatarLocalPath = req.file?.path;
  console.log("avatarLocalPath: " + avatarLocalPath)

  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar file is missing");
  }
  
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log("avatar: " + avatar.access_control)


  if (!avatar.url) {
    throw new ApiError(401, "Error while uploading the image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(401, "cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(coverImage);

  if (!coverImage.url) {
    throw new ApiError(401, "Error while uploading the image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "User name is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions", // "Subscription" model as pural in mongodb
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions", // "Subscripton" model as pural in mongodb
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $lookup:{
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedChannels: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        totalVideos: {
          $size: "$videos"
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscribedChannels: 1,
        isSubscribed: 1,
        totalVideos: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        bio: 1,
      },
    },
  ]);

  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel, "User channel  fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  console.log("watchHistory: ", user);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History fetch successfully"
      )
    );
});

const addVideoToWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const alreadyExists = user.watchHistory.some(
      (watchedVideoId) => watchedVideoId.toString() === videoId
    );

    if (alreadyExists) {
      user.watchHistory = [
        videoId,
        ...user.watchHistory.filter((watchedVideoId) => watchedVideoId.toString() !== videoId),
      ];
    } else {
      user.watchHistory.unshift(videoId);
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(200, user.watchHistory, "Watch history updated successfully")
    );
  } catch (error) {
    console.log("Error adding video to watch history:", error.message);
    throw new ApiError(500, "Unable to update watch history");
  }
};
 


export {
  registerUser,
  loginUser,
  signUpUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  addVideoToWatchHistory
};
