import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const WatchVideo = () => {
    const { videoId } = useParams();
    const host = "http://localhost:8000/api/v1";
    console.log("searchId: " + videoId);
    const [videoDetails, setVideoDetails] = useState(null);
    
    // const {url} = useParams()
    // const videoId = extractVideoId(url)
    // console.log("searchId: " + videoId);
    
    // function extractVideoId(url) {
    //     const match = url.match(/[?&]v=({[^&]+)/)
    //     return match ? match[1] : null
    // }

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`${host}/videos/${videoId}`);
                console.log("Watch Video: ", response.data);
                setVideoDetails(response.data);
            } catch (error) {
                console.log("Watch Video", error.message);
            }
        }
        fetchVideo();
    }, [videoId]); // Add videoId as a dependency to re-run the effect when the videoId changes

    return (
        <div>
            {/* Display video details or loading indicator */}
            {videoDetails ? (
                <div>
                    <h1>Watch Video</h1>
                    {/* Render video details here */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default WatchVideo;
