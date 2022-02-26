import React, { useRef, useState } from "react";
import "./login.css";
import { CircularProgress } from "@material-ui/core";

export default function Login() {
  localStorage.clear();
  const phoneno = useRef();
  const isFetching = false;
  const [isAuth, setIsAuth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleClick = async (e) => {
    //e.preventDefault();
    try {
      const phonenumber = phoneno.current.value;
      const body = {
        phonenumber,
      };
      console.log(body);
      const response = await fetch("http://localhost:9000/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.isAuthenticated) {
        setIsAuth(true);
        localStorage.setItem("isAuthed", true);
        localStorage.setItem("phoneNum", phonenumber);

        window.location = "/";
      } else {
        localStorage.clear();
        //window.location = "/login";
      }
    } catch (err) {
      console.error(err.message);
      window.location = "/login";
      localStorage.clear();
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Melzcafe</h3>
          <span className="loginDesc">
            Your local one stop cafe for the best coffee, breakfast & lunch!
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Phone number"
              type="tel"
              required
              className="loginInput"
              ref={phoneno}
            />

            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
