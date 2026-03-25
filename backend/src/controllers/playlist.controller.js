import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videoId } = req.body;

    //TODO: create playlist

    if (!name) {
        throw new ApiError(404, "please provide a name");
    }

    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: req.user._id,
        videos: videoId,
    });
    console.log(playlist);

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists

    const playlists = await Playlist.find({owner: userId})

    return res.status(200).json(
        new ApiResponse(
            200,
            playlists,
            'Playlist fetched successfully'
        )
    );
    
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id

    const playlist = await Playlist.findById(playlistId).populate("videos"); // Populate the videos field

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!(playlistId && videoId)) {
        throw new ApiError(404, "Invalid playlist or video");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: {
                    $each: [videoId], // Pass an array of video IDs
                }
            },
        },
        {
            new: true,
        }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist successfully"
            )
        );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!(playlistId && videoId)) {
        throw new ApiError(404, "Invalid playlist or video");
    }

    try {
        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { $pull: { videos: videoId } },
            { new: true }
        );

        if (!updatedPlaylist) {
            return res.status(404).json({
                success: false,
                error: 'Playlist not found',
            });
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedPlaylist,
                'Video removed from playlist successfully'
            )
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist

    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new ApiResponse(
            200,
            deletePlaylist,
            'Playlist deleted successfully'
        )
    );
    
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId, 
        {
            $set: { 
                name: name,
                 description: description
            }
        },
        {
            new: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatePlaylist,
            'Playlist Updated successfully'
        )
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
