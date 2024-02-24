import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";

const Home = () => {
  const host = "http://localhost:8000/api/v1";
  const [videos, setVideos] = useState([]);
  const { sidebar } = useContext(UserContext);

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
            background: "white",
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
              background: "#000",
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
                <Link to={`/watch/${video?.owner?._id}`}>
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail || "images/1.png"}
                    style={{
                      width: 400,
                      height: 220,
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
                        style={{ width: 50, borderRadius: "50%" }}
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
                      {video.views} {video.views === 0 || 1 ? "view" : "views"}{" "}
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
            background: "white",
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
              background: "#000",
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
                <Link to={`/watch?v=${video?.owner?._id}`}>
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail || "images/1.png"}
                    style={{
                      width: "23%",
                      objectFit: "contain",
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
                        style={{ width: 50, borderRadius: "50%" }}
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
                      {video.views} {video.views === 0 || 1 ? "view" : "views"}{" "}
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
