import React from 'react'

const RandomChannelHome = () => {
    const host = "https://videotube-backend-5fg2.onrender.com/api/v1";
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
            console.log("Random User: ", response.data.data[0].avatar);
          }
        } catch (error) {
          console.log(error.message, "error getting RandomuserData access token");
        }
      };
      fetchUser();
    }, []);
  return (
    <div>RandomChannelHome</div>
  )
}

export default RandomChannelHome