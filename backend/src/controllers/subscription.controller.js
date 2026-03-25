import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"



const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        const {channelId} = req.params
        console.log("channel: " + channelId);
    
        // TODO: toggle subscription
        const channel = await User.findById(channelId) 
        console.log("channel: " + channel);
        
        const subscriber = await User.findById(req.user._id)
        console.log("user: " + subscriber);

        
        if (!channel || !subscriber) {
            throw new ApiError(404, "Channel or user not found", "User or channel not found");
        }

        const isSubscribed = await Subscription.findOne({subscriber: subscriber._id, channel: channel._id});

        // const subscriber = await Subscription.?

        if (isSubscribed) {
            await Subscription.findOneAndDelete({ subscriber: subscriber._id, channel: channel._id });
            return res.status(200).json(new ApiResponse(200, { channel, subscriber, isSubscribed: false}, "Unsubscribed successfully"));
        }else{
            const newSubscription = new Subscription({ subscriber: subscriber._id, channel: channel._id });
            await newSubscription.save();
            return res.status(200).json(new ApiResponse(200, { channel, subscriber, isSubscribed: true}, "Subscribed successfully"));
        }
    } catch (error) {
        throw new ApiError(400, error.message, "User channelId not found")
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;

        const subscribers = await Subscription.find({ channel  : channelId }).populate("subscriber channel");

        console.log(subscribers);
        return res.status(200).json(new ApiResponse(200, subscribers, "User channel fetched successfully"));
    } catch (error) {
        // Handle errors
        console.error("Error fetching subscribers:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});


const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        // Extract subscriberId from request parameters
        const { subscriberId } = req.params;

        // Validate subscriberId
        if (!subscriberId) {
            return res.status(400).json(new ApiResponse(400, null, "Subscriber ID is missing"));
        }

        // Find all subscriptions for the subscriber
        const subscribers = await Subscription.find({ subscriber: subscriberId }).populate("subscriber channel").select("-watchHistory -refreshToken");

        // Fetch videos for each channel
        const channelsWithVideos = await Promise.all(subscribers.map(async (subscriber) => {
            // Fetch videos for the channel
            const channelVideos = await Video.find({ owner: subscriber.channel._id.toString() }).populate("owner");

            console.log("video Channel ID", subscriber.channel._id.toString());
            // Combine subscriber information with videos
            return {
                ...subscriber.toObject(),
                videos: channelVideos
            };
        }));

        console.log("channelsWithVideos", channelsWithVideos);

        return res.status(200).json(new ApiResponse(200, channelsWithVideos, "Subscribed channels fetched successfully"));
    } catch (error) {
        console.error("Error fetching subscribed channels:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
