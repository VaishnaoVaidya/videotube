import {upload} from "../middlewares/multer.middleware.js";
import {Tweet} from "../models/tweet.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";


const getUserTweets = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, sortBy, createdAt } = req.query;

        const userId = req.user._id;

        const filter = { owner: userId };

        const sort = {};

        if (sortBy) {
            sort[sortBy] = createdAt === 'desc' ? -1 : 1;
        } else {
            // If sortBy is not provided, default to sorting by createdAt
            sort.createdAt = createdAt === 'desc' ? -1 : 1;
        }

        const tweets = await Tweet.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        console.log(tweets);

        return res.status(200).json(
            new ApiResponse(
                200,
                tweets,
                "All Tweets fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, error.message, "Internal error");
    }
});


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Tweet content must be at least 1 character");
    }

    let tweetImageLocalPath;
    if (req.file) {
        // Use req.file instead of req.files.tweetImage
        tweetImageLocalPath = req.file.path;
    }

    const tweetImage = await uploadOnCloudinary(tweetImageLocalPath);

    console.log("Content:", content);
    console.log("Tweet Image Local Path:", tweetImageLocalPath);

    const tweet = await Tweet.create({
        content,
        tweetImage: tweetImage.url,
        owner: req.user._id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet created successfully"
        )
    );
});

const updateTweet = asyncHandler ( async (req, res) => {
    const { tweetId } = req.params

    const { content } = req.body

     
    const tweetImageLocalPath = req.file?.path

    const tweetImage = await uploadOnCloudinary(tweetImageLocalPath)
    console.log(tweetImage);

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
                tweetImage: tweetImage.url
            }
        },
        {
            new : true
        }
    )

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "updated details successfully"
        )
    )


})

const deleteTweet = asyncHandler ( async (req, res) => {
    const { tweetId } = req.params

    const updatedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!updateTweet){
        throw new ApiError(400, "Tweet image not found")
    }

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "deleted details successfully"
        )
    )


})


export {createTweet, deleteTweet, updateTweet, getUserTweets  }