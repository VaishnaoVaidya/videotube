import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {formatDistanceToNow} from 'date-fns';
import UserContext from "../../context/UserContext";
const LikedVideos = () => {
  const host = "http://localhost:8000/api/v1";
  const [likedVideos, setLikedVideos] = useState([]);
  const {accessToken} = useContext(UserContext)
  const {sidebar} = useContext(UserContext)

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try {
        const response = await axios.get(`${ host }/videos/allvideos`, {
          headers: {
            Authorization: `Bearer ${ accessToken }`,
          },
        });
        // console.log('Response Data Type:', response.data.data);

        // Check the type of response data
        if (response.data && Array.isArray(response.data.data)) {
          setLikedVideos(response.data.data);
        } else {
          console.error('Invalid data format received');
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData()

  }, []);
  
  return (
    <>
      {sidebar ? (
       <div style={{marginLeft: 240,paddingTop: 56, background: "white",flexWrap: "wrap", }}>
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
            likedVideos.map((video, i) =>
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
                  src={video?.thumbnail || "images/1.png"}
                  style={{width: "100%", height: "100%", borderRadius: " 5px"}}
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
                    <a style={{fontSize: 16, fontWeight: "bold", top: 0}} href="/">
                      {video.tittle}
                    </a>
                    <a style={{fontSize: 12, fontWeight: "bold", top: 0}} href="/">
                      {video.owner.fullName}
                    </a>
                    <a style={{fontSize: 12, fontWeight: "bold", top: 0}} href="/">
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
    ) : (
       <div style={{flex: 1, marginLeft: 100, background: "white",position: "fixed", left: -20 ,top: 56,flexWrap: "wrap", width: "100%", height: 400}}>
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
           likedVideos.map((video, i) =>
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
                 src={video.thumbnail || "images/1.png"}
                 style={{width: "100%", height: "100%", borderRadius: " 5px"}}
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
                   <a style={{fontSize: 16, fontWeight: "bold", top: 0}} href="/">
                     {video.tittle}
                   </a>
                   <a style={{fontSize: 12, fontWeight: "bold", top: 0}} href="/">
                     {video.owner.fullName}
                   </a>
                   <a style={{fontSize: 12, fontWeight: "bold", top: 0}} href="/">
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
    )}
    </>
  )
}

export default LikedVideos
