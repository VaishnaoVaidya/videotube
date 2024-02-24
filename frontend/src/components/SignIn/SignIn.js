import axios from "axios";
import React, {  useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

const SignIn = () => {

  const navigate = useNavigate();
  const host = "http://localhost:8000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${host}/api/v1/users/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.data.user);
        console.log(response.data.data.accessToken);
        localStorage.setItem('accessToken', response.data.data.accessToken);
        navigate("/");
      } else {
        console.error("Authentication failed:", response.data.message);
        alert("Invalid login credentials");
      }
    } catch (error) {
      console.error("Error during SignIn:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
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
            textAlign: "center",
            marginTop: 100,
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
                border: "2px solid rgb(45 143 228)",
                color: "white",
              }}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username"
              name="username"
              maxLength={50}
              onFocus={(e) => (e.target.style.borderColor = "rgb(45 143 228)")}
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
                border: "2px solid rgb(45 143 228)",
                color: "white",
              }}
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              name="Password"
              maxLength={50}
              onFocus={(e) => (e.target.style.borderColor = "rgb(45 143 228)")}
              //   onBlur={(e) => e.target.style.borderColor = "rgb(45 143 228)"}
            />

            <button
              onClick={handleSubmit}
              style={{
                height: 40,
                textAlign: "center",
                width: 250,
                borderRadius: 5,
                margin: 30,
                marginLeft: 60,
                fontSize: 15,
                background: "yellow",
                borderColor: "2px solid rgb(45 143 228)",
                cursor: "pointer",
                color: "black",
                fontSize: 19,
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {" "}
              {loading ? "Signing In..." : "Submit"}
            </button>

            <h6
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 15,
                borderColor: "2px solid rgb(45 143 228)",
                cursor: "pointer",
                fontSize: 19,
                fontWeight: "bold",
              }}
            >
              Don't have an account!!{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{ color: "#34add7" }}
              >
                {" "}
                SignUp
              </span>
            </h6>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
