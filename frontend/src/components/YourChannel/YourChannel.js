import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import HomePage from "../HomePage/HomePage";
import {formatDistanceToNow} from "date-fns";

const YourChannel = () => {
  const host = "http://localhost:8000/api/v1";
  const [channelData, setChannelData] = useState([]);
  const [channelVideos, setChannelVideos] = useState([]);
  const { username } = useParams();
  const {sidebar} = useContext(UserContext);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        // Check if there's a stored access token in localStorage
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/users/channel/${username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log("fetchChannel", response.data);
        setChannelData(response.data.data);
        console.log("Your Channel: ",response.data.data);
      } catch (error) {}
    };
    fetchChannel();
  }, [username]);

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        // Check if there's a stored access token in localStorage
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/videos`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log("fetchChannel", response.data);
        setChannelVideos(response.data.data);
        console.log("Your Channel videos: ",response.data.data);
      } catch (error) {
        console.log("Your Channel videos error: ", error.message);

      }
    };
    fetchChannelVideos();
  }, [username]);

  const Home = () => {
    return (
      <>
        {
          channelVideos && channelVideos.map((video, i)=>

          <div
          style={{  width:"100%", height: "100%",      backgroundColor: "rgb(0, 0, 0)",
        }}
          >
              <div
                key={i}
                style={{
                  width: '20vw',
                  height: "auto",
                  margin: "10px",
                  boxShadow: "inherit",
                }}
              >
                <Link to={`/watch/${video._id}`}>
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail || "images/1.png"}
                    style={{
                      width: '20vw',
                      height: "25vh",
                      objectFit: 'cover',
                      borderRadius: " 10px",
                    }}
                    alt=""
                  />
                </Link>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: 1,
                    alignItems: "flex-start",
                    marginTop: 6,
                  }}
                >
                  <div>
                    {/* Owner Details */}
                    <Link to={`/${video?.owner?.username}`}>
                      <img
                        src={video.owner.avatar}
                        style={{ width: 40, height: 40,  borderRadius: "50%" , marginRight: 10 }}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      paddingLeft: 3,
                      alignItems: "flex-start",
                      color: "white",
                    }}
                  >
                    <Link
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        top: 0,
                        textDecoration: "none",
                        color: "white",
                      }}
                      to="/"
                    >
                      {video?.title || video?.tittle}
                    </Link>
                    <Link
                      style={{
                        fontSize: 16,
                        color: "#AAAAAA",
                        fontWeight: "400",
                        marginTop: 5,
                        textDecoration: "none",
                      }}
                      to="/"
                    >
                      {video.owner.fullName}
                    </Link>
                    <Link
                      style={{
                        marginTop: 0,
                        fontSize: 16,
                        color: "#AAAAAA",
                        fontWeight: "400",
                        gap: 8,
                        textDecoration: "none",
                      }}
                      to="/"
                    >
                      {video.views} {video.views === 0 || 1 ? "view" : "views"}{"  | "}
                      <span>
                        {formatDistanceToNow(new Date(video.createdAt))} ago
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
          </div>
          ) 
        }

         {
          channelVideos.length === 0 && (    
            <div style={{display: "flex", width: "100%", height: "100%", justifyContent: "center",marginTop:"100px" , alignItems: "center", flexDirection:"column"}}>
          <img src="https://cdn-icons-png.flaticon.com/512/3146/3146092.png " width="256" height="256" alt="" title="" class="img-small"/>
          <h4>No videos found</h4>
            </div>
        )
        }
        
       
      </>
    )
  }

  return (
   <>
   {
    sidebar ? (
      <div style={{marginLeft: 240,paddingTop: 56,         backgroundColor: "rgb(0, 0, 0)"
      ,flexWrap: "wrap",       height: "100%" ,
    }}>

    
      {channelData.map((channel) => (
        <div
          key={channel._id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 75,
            marginTop: 20,
            justifyContent: "flex-start",
          }}
        >
          <img
            src={channel?.avatar || "images/unknown.png"}
            style={{

              height: 160,
              width: 160,
              borderRadius: "50%",
              border: "1px solid gray",
              borderColor: "white",
              paddingRight: 20,
            }}
            alt=""
          />

          <div style={{ marginTop: 0, marginLeft: 19 }}>
            <h1 style={{ fontSize: 30, fontWeight: "bold", marginTop: 0 }}>
              {channel.fullName}
            </h1>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 400,
                display: "flex",
                marginTop: 0,
              }}
            >
              @{channel.username}{" |"}
              <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" "}
                {channel.subscribersCount === 0 ? "" : `${channel.subscribersCount} ${channel.subscribersCount !== 1 ? "subscribers" : "subscriber"}`}
              </span>
              <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" | "}
                {channel.totalVideos === 0 ? "" : `${channel.totalVideos} ${channel.totalVideos !== 1 ? "videos" : "video"}`}
              </span>
            </h1>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 400,
                display: "flex",
                marginTop: 0,
              }}
            >
              Bio: This channel is about trend {">"}
            </h1>
            {/* Add more details as needed */}
          </div>
        </div>
      ))}
      <div>
        <ul
          style={{
            display: "flex",
            textDecoration: "none",
            fontSize: 18,
            fontWeight: "bold",
            listStyle: "none",
            gap: 20,
            marginLeft: 40,
            marginTop: 50,
            cursor: "pointer",
                      }}
        >
          <li style={{ transition: "color 0.3s" , paddingInline: 10}}>
            <Link to={`/channel/${username}`} style={{ color: "#fff", textDecoration: "none" }}
             onMouseOver={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onMouseOut={(e) => (e.target.style.color = "white", (e.target.style.borderBottom = "none"))}
             onFocus={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onBlur={(e) => (e.target.style.borderBottom = "2px solid transparent")}
             
            >
              Home
            </Link>
          </li>
          <li style={{ transition: "color 0.3s", paddingInline: 10 }}>
            <Link to={`/channel/${username}/playlists`} style={{ color: "#fff", textDecoration: "none" }}
             onMouseOver={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onMouseOut={(e) => (e.target.style.color = "white", (e.target.style.borderBottom = "none"))}
             onFocus={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
            onBlur={(e) => (e.target.style.borderBottom = "2px solid transparent")}
             
            >
              Playlists
            </Link>
          </li>
        </ul>
        <hr style={{ backgroundColor: "#262a2d", marginTop: -3 }} />
      </div>

      <div
        style={{
          marginLeft: 60,
            marginTop: 20,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          padding: 5,
          alignItems: "flex-end",
          flexWrap: "wrap",
          background: "rgb(0, 0, 0)",
          display: "flex",
          gap: 15
        }}>

        <Home/>
      </div>
    </div>

    
    ) : (
      <>
       <div
      style={{
        width: "auto",
        height: "100%" ,
        backgroundColor: "rgb(0, 0, 0)",
        color: "white",
        marginLeft: 80,
        paddingTop: 60,
        top: 57,
      }}
    >
     {channelData.map((channel) => (
        <div
          key={channel._id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 75,
            marginTop: 20,
            justifyContent: "flex-start",
          }}
        >
          <img
            src={channel?.avatar || "images/unknown.png"}
            style={{
              height: 160,
              width: 160,
              borderRadius: "50%",
              border: "1px solid gray",
              borderColor: "white",
              paddingRight: 20,
            }}
            alt=""
          />

          <div style={{ marginTop: 0, marginLeft: 19 }}>
            <h1 style={{ fontSize: 30, fontWeight: "bold", marginTop: 0 }}>
              {channel.fullName}
            </h1>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 400,
                display: "flex",
                marginTop: 0,
              }}
            >
              @{channel.username}{" |"}
              <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" "}
                {channel.subscribersCount === 0 ? "" : `${channel.subscribersCount} ${channel.subscribersCount !== 1 ? "subscribers" : "subscriber"}`}
              </span>
              <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" | "}
                {channel.totalVideos === 0 ? "" : `${channel.totalVideos} ${channel.totalVideos !== 1 ? "videos" : "video"}`}
              </span>
            </h1>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 400,
                display: "flex",
                marginTop: 0,
              }}
            >
              Bio: This channel is about trend {">"}
            </h1>
            {/* Add more details as needed */}
          </div>
        </div>
      ))}
      <div>
        <ul
          style={{
            display: "flex",
            textDecoration: "none",
            fontSize: 18,
            fontWeight: "bold",
            listStyle: "none",
            gap: 20,
            marginLeft: 40,
            marginTop: 50,
            cursor: "pointer",
                      }}
        >
          <li style={{ transition: "color 0.3s" , paddingInline: 10}}>
            <Link to={`/channel/${username}`} style={{ color: "#fff", textDecoration: "none" }}
             onMouseOver={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onMouseOut={(e) => (e.target.style.color = "white", (e.target.style.borderBottom = "none"))}
             onFocus={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onBlur={(e) => (e.target.style.borderBottom = "2px solid transparent")}
             
            >
              Home
            </Link>
          </li>
          <li style={{ transition: "color 0.3s", paddingInline: 10 }}>
            <Link to={`/channel/${username}/playlists`} style={{ color: "#fff", textDecoration: "none" }}
             onMouseOver={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onMouseOut={(e) => (e.target.style.color = "white", (e.target.style.borderBottom = "none"))}
             onFocus={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
            onBlur={(e) => (e.target.style.borderBottom = "2px solid transparent")}
             
            >
              Playlists
            </Link>
          </li>
        </ul>
        <hr style={{ backgroundColor: "#262a2d", marginTop: -3 }} />
      </div>

      <div
       style={{
        marginLeft: 80,
            paddingTop: 56,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        padding: 5,
        alignItems: "flex-end",
        flexWrap: "wrap",
        background: "#rgb(0, 0, 0)",
      }}>
        <Home />
      </div>
    </div>
      </>
    )
   }

   
   </>
  );
};

export default YourChannel;
