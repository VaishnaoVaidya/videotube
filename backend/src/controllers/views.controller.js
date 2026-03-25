import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const views = asyncHandler( async(req, res) => {
    try {
        const { videoId } = req.body;
    
        // Find the video by ID and increment the view count
        const video = await Video.findByIdAndUpdate(
          videoId,
          { $inc: { views: 1 } },
          { new: true }
        );
    
        res.json({ success: true, video });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
      }
})

export  {views}