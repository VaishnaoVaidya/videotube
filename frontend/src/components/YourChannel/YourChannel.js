import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import HomePage from "../HomePage/HomePage";

const YourChannel = () => {
  const host = "http://localhost:8000/api/v1";
  const [channelData, setChannelData] = useState([]);
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

  return (
   <>
   {
    sidebar ? (
      <div style={{marginLeft: 240,paddingTop: 56, background: "#000",flexWrap: "wrap",         height: "100%" ,
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
    </div>
    ) : (
      <>
       <div
      style={{
        width: "auto",
        height: "100%" ,
        background: "black",
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
    </div>
      </>
    )
   }
   </>
  );
};

export default YourChannel;
