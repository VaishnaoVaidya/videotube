import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { set } from "date-fns";

const RandomuserData = () => {
  const host = "http://localhost:8000/api/v1";
  const { sidebar } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${host}/users/channel/${username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        });

        if (response.data.success) {
          setUserData(response.data.data[0]);
          console.log("Random User: ", response.data.data);
        }
      } catch (error) {
        console.log(error.message, "error getting RandomuserData access token");
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      {sidebar ? (
       <>
       {
        userData && (
          <div
          style={{
            paddingLeft: 240,
            paddingTop: 56,
            display: "flex",
            marginInline: "auto",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <img
            src={userData?.coverImage || "images/cover.jpg"}
            style={{
              width: "80%",
              height: 200,
              borderRadius: 15,
              border: "1px solid red",
              marginInline: "auto",
            }}
            alt=""
          />

          <div
            key={userData._id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginLeft: 125,
              marginTop: 20,
              justifyContent: "flex-start",
            }}
          >
            <img
              src={userData?.avatar || "images/unknown.png"}
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
                {userData.fullName}
              </h1>
              <h1
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  display: "flex",
                  marginTop: 0,
                }}
              >
                @{userData.username}{" "}
                <span
                   style={{
                     paddingLeft: 6,
                   }}
                 >
                   {" "}
                   {userData.subscribersCount === 0 ? "" : `${userData.subscribersCount} ${userData.subscribersCount !== 1 ? "subscribers" : "subscriber"}`}
                 </span>
                 <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" | "}
                {userData.totalVideos === 0 ? "" : `${userData.totalVideos} ${userData.totalVideos !== 1 ? "videos" : "video"}`}
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
                Bio: This userData is about trend {">"}
              </h1>
              {/* Add more details as needed */}
            </div>
          </div>
          <div style={{display: "flex", marginLeft: 35}}>
        <ul
          style={{
            display: "flex",
            textDecoration: "none",
            fontSize: 18,
            fontWeight: "bold",
            listStyle: "none",
            gap: 10,
            marginLeft: 40,
            marginTop: 30,
            cursor: "pointer",
                      }}
        >
          <li style={{ transition: "color 0.3s" , paddingInline: 10}}>
            <Link to={`/home/${username}`} style={{ color: "#fff", textDecoration: "none" }}
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
              Videos
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
      </div>
          <hr style={{ width: "90%", color: "white", border: "0.5px solid red", marginInline: "auto", marginTop: 0}}/>
        </div>
        )
       }
       </>
      ) : (
        <>
        {
         userData && (
           <div
           style={{
             paddingLeft: 60,
             paddingTop: 56,
             display: "flex",
             marginInline: "auto",
             alignItems: "center",
             flexWrap: "wrap",
           }}
         >
           <img
             src={userData?.coverImage || "images/cover.jpg"}
             style={{
               width: "80%",
               height: 200,
               borderRadius: 15,
               border: "1px solid red",
               marginInline: "auto",
             }}
             alt=""
           />
 
           <div
             key={userData._id}
             style={{
               display: "flex",
               flexDirection: "row",
               alignItems: "center",
               width: "100%",
               marginLeft: 145,
               marginTop: 20,
               justifyContent: "flex-start",
             }}
           >
             <img
               src={userData?.avatar || "images/unknown.png"}
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
                 {userData.fullName}
               </h1>
               <h1
                 style={{
                   fontSize: 14,
                   fontWeight: 400,
                   display: "flex",
                   marginTop: 0,
                 }}
               >
                 @{userData.username}{" |"}
                 <span
                   style={{
                     paddingLeft: 6,
                   }}
                 >
                   {" "}
                   {userData.subscribersCount === 0 ? "" : `${userData.subscribersCount} ${userData.subscribersCount !== 1 ? "subscribers" : "subscriber"}`}
                 </span>
                 <span
                style={{
                  paddingLeft: 6,
                }}
              >
                {" | "}
                {userData.totalVideos === 0 ? "" : `${userData.totalVideos} ${userData.totalVideos !== 1 ? "videos" : "video"}`}
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
                 Bio: This userData is about trend {">"}
               </h1>
               {/* Add more details as needed */}
             </div>
           </div>
           <div style={{display: "flex", marginLeft: 55}}>
         <ul
           style={{
             display: "flex",
             textDecoration: "none",
             fontSize: 18,
             fontWeight: "bold",
             listStyle: "none",
             gap: 10,
             marginLeft: 40,
             marginTop: 30,
             cursor: "pointer",
                       }}
         >
           <li style={{ transition: "color 0.3s" , paddingInline: 10}}>
             <Link to={`/home/${username}`} style={{ color: "#fff", textDecoration: "none" }}
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
               Videos
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
       </div>
           <hr style={{ width: "90%", color: "white", border: "0.5px solid red", marginInline: "auto", marginTop: 0}}/>
         </div>
         )
        }
        </>
      )
      }
    </div>
  );
};

export default RandomuserData;
