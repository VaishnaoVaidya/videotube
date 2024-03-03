import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";

const Home = () => {
  const host = "http://localhost:8000/api/v1";
  const { sidebar } = useContext(UserContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if there's a stored access token in localStorage
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/videos/allvideos`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log('Response Data Type:', response.data.data);

        // Check the type of response data
        if (response.data && Array.isArray(response.data.data)) {
          setVideos(response.data.data);
          console.log(  "Home", response.data.data);
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {sidebar ? (
        <div
          style={{
            marginLeft: 240,
            paddingTop: 56,
            background: "rgb(15, 15, 15)",
            flexWrap: "wrap",
          }}
        >
          <aside
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              padding: 5,
              alignItems: "flex-end",
              flexWrap: "wrap",
              background: "rgb(15, 15, 15)",
              display: "flex",
              gap: 15
            }}
          >
            {videos.map((video, i) => (
              <div
                key={i}
                style={{
                  width: "30%",
                  margin: "10px",
                  boxShadow: "inherit",
                }}
              >
                <Link to={`/watch/${video._id}`}>
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail || "images/1.png"}
                    style={{
                      width: '100%',
                      height: 220,
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
            ))}

            <hr />
          </aside>
        </div>
      ) : (
        <div
          style={{
            marginLeft: 80,
            paddingTop: 56,
            background: "rgb(15, 15, 15)",
            flexWrap: "wrap",
          }}
        >
          <aside
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              padding: 5,
              alignItems: "flex-end",
              flexWrap: "wrap",
              background: "#rgb(15, 15, 15)",
            }}
          >
            {videos.map((video, i) => (
              <div
                key={i}
                style={{
                  width: "23%",
                  margin: "10px",
                  boxShadow: "inherit",
                }}
              >
                <Link to={`/watch/${video._id}`}>
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail || "images/1.png"}
                    style={{
                      width: "100%",
                      height: 190,
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
                        style={{ width: 40,height: 40, borderRadius: "50%" , marginRight: 10}}
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
            ))}

            <hr />
          </aside>
        </div>
      )}
    </>
  );
};

export default Home;
