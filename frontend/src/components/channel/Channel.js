import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Channel = () => {
  const host = "http://localhost:8000/api/v1";
  const [channelData, setChannelData] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM3ODg0ZTg1MDM4MDBjN2I2Yzk2NTMiLCJ1c2VybmFtZSI6ImZpdmUiLCJlbWFpbCI6ImZpdmVAZ21haWwuY29tIiwiaWF0IjoxNzA3NjMyMTczLCJleHAiOjE3MDc3MTg1NzN9.TZBh7GyUDL8HLWYKgD_biw2Egs1szKL6Nk5ENz3Ds7E";
        const response = await axios.get(`${host}/users/channel/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("fetchChannel", response.data);
        setChannelData(response.data.data);
      } catch (error) {}
    };
    fetchChannel();
  }, [username]);

  return (
    <div
      style={{
        width: "auto",
        height: "auto",
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
              height: 100,
              width: 100,
              borderRadius: "50%",
              border: "1px solid gray",
              borderColor: "white",
              paddingRight: 20,
            }}
            alt=""
          />

          <div style={{ marginTop: 0, marginLeft: 19 }}>
            <h1 style={{ fontSize: 30, fontWeight: "bold", marginTop: 0 }}>
              {channel.email}
            </h1>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 400,
                display: "flex",
                marginTop: 0,
              }}
            >
              @{channel.username}{" "}
              <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" "}
                {7} subscribers
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
            borderBottom: "1px solid red",
          }}
        >
          <li style={{ transition: "color 0.3s" , paddingInline: 10}}>
            <Link to={`/channel/${username}/home`} style={{ color: "#fff", textDecoration: "none" }}
             onMouseOver={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onMouseOut={(e) => (e.target.style.color = "white", (e.target.style.borderBottom = "none"))}
             onFocus={(e) => (e.target.style.color = "red", (e.target.style.borderBottom = "2px solid red" , (e.target.style.paddingBottom = "12px")))}
             onBlur={(e) => (e.target.style.borderBottom = "2px solid transparent")}
             
            >
              Home
            </Link>
          </li>
          <li style={{ transition: "color 0.3s", paddingInline: 10 }}>
            <Link to={`/channel/${username}/playlist`} style={{ color: "#fff", textDecoration: "none" }}
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
  );
};

export default Channel;
