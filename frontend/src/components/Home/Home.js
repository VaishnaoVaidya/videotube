import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';


const Home = () => {
  const host = "http://localhost:8000/api/v1";
  const [videos, setVideos] = useState([]);



  // useEffect( () => {
  //   const fetchData = async () => {
  //     try {
  //       const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM3ODg0ZTg1MDM4MDBjN2I2Yzk2NTMiLCJ1c2VybmFtZSI6ImZpdmUiLCJlbWFpbCI6ImZpdmVAZ21haWwuY29tIiwiaWF0IjoxNzA3NjMyMTczLCJleHAiOjE3MDc3MTg1NzN9.TZBh7GyUDL8HLWYKgD_biw2Egs1szKL6Nk5ENz3Ds7E'; 
  //       const response = await axios.get(`${host}/videos/allvideos`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // console.log('Response Data Type:', response.data.data);

  //     // Check the type of response data
  //     if (response.data && Array.isArray(response.data.data)) {
  //       setVideos(response.data.data);
  //     } else {
  //       console.error('Invalid data format received');
  //     }
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchData()
   
  // }, []);

 
  
  

  return (
    <div style={{ paddingTop: 56, paddingLeft: 80 ,}}>
      <aside
        style={{
          border: "1px solid red",
          display: "flex",
          flexDirection: "row",
          padding: 5,
          alignItems: "flex-end",
          flexWrap: "wrap",
          background: "#000",
        }}
      >
        {
          videos.map((video, i) =>
          (
            <div
            key={i}
          style={{
            width: "21%",
            margin: "10px",
            border: "1px solid #ddd",
            boxShadow: "inherit",
          }}
        >
          <img
            src={video.thumbnail}
            style={{ width: "100%", height: "100%", borderRadius: " 5px" }}
            alt=""
          />
          <div
            style={{
              border: "1px solid red",
              display: "flex",
              justifyContent: "flex-start",
              padding: 1,
              alignItems: "flex-start",
            }}
          >
            <div>
              <img src={video.owner.avatar} style={{width: 50, borderRadius: "50%"}} alt="" />
            </div>
            <div
              style={{
                border: "1px solid red",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 3,
                alignItems: "flex-start",
              }}
            >
              <a style={{ fontSize: 16, fontWeight: "bold", top: 0 }} href="/">
                {video.tittle}
              </a>
              <a style={{ fontSize: 12, fontWeight: "bold", top: 0 }} href="/">
                {video.owner.fullName}
              </a>
              <a style={{ fontSize: 12, fontWeight: "bold", top: 0 }} href="/">
                {video.views} {video.views === 0 || 1 ? "view" : "views"} <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
              </a>
            </div>
          </div>
        </div>
          ))
        }
        
        <hr />
      </aside>
    </div>
  );
};

export default Home;
