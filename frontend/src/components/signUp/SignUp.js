import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const SignUp = () => {

    const navigate = useNavigate()
    const host = "http://localhost:8000";
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const response = await axios.post(`${host}/api/v1/users/signup`, {
              email: email,
              password: password,
              username: username,
          });
          navigate("/login")
          alert("SignUp successful")
          console.log('Sign Up success', response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === 'User with email or username already exists') {
          // Handle the case where the user already exists
          console.log('User with email or username already exists');
          // You can update your state or show an error message here
        } else {
          console.error('Error during SignIn:', error.message);
        }

      }
  };
  
  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "auto",
            width: 450,
            border: "1px solid blue",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 100,
            textAlign: "center",
            borderRadius: 10,
            background: "black",
            color: "#eef3f2db",
          }}
        >
          <form action="">
            <h2>Create your account</h2>
            <input
              style={{
                height: 40,
                width: 350,
                borderRadius: 5,
                marginTop: 30,
                paddingLeft: 9,
                fontSize: 15,
                background: "black",
                borderColor: "2px solid rgb(45 143 228)",
                color: "white",
              }}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              name="username"
              maxLength={50}
              onFocus={(e) => e.target.style.borderColor = "rgb(102 45 228)"}
            //   onBlur={(e) => e.target.style.borderColor = "rgb(45 143 228)"}
            />
            <input
              style={{
                height: 40,
                width: 350,
                borderRadius: 5,
                marginTop: 30,
                paddingLeft: 9,
                fontSize: 15,
                background: "black",
                borderColor: "2px solid rgb(45 143 228)",
                color: "white",
              }}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              name="email"
              maxLength={50}
              onFocus={(e) => e.target.style.borderColor = "rgb(102 45 228)"}
            //   onBlur={(e) => e.target.style.borderColor = "rgb(45 143 228)"}
            />
            <input
              style={{
                height: 40,
                width: 350,
                borderRadius: 5,
                marginTop: 30,
                paddingLeft: 9,
                fontSize: 15,
                background: "black",
                borderColor: "2px solid rgb(45 143 228)",
                color: "white",
              }}
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              name="Password"
              maxLength={50}
              onFocus={(e) => e.target.style.borderColor = "rgb(102 45 228)"}
            //   onBlur={(e) => e.target.style.borderColor = "rgb(45 143 228)"}
            />

            <button
            onClick={handleSubmit}
             style={{height: 40,
                textAlign: "center",
                width: 250,
                borderRadius: 5,
                margin: 30,
                marginLeft: 60,
                fontSize: 15,
                background: "yellow",
                borderColor: "2px solid rgb(45 143 228)",
                cursor: "pointer",
                color: "black", fontSize: 19, fontWeight: "bold"}}>Submit</button>

              <h6 style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 15,
                borderColor: "2px solid rgb(45 143 228)",
                cursor: "pointer",
                 fontSize: 19, fontWeight: "bold"}}>Already have an account!! <span onClick={()=> navigate("/signup")} style={{color: "#34add7"}}> LogIn</span></h6>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
