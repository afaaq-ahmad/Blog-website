import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../signup/SignupStyle.css";
import addProfile from "../images/user_848043.png";
import axios from "axios";
import ToastrSuccess from "../components/common/ToastrSuccess";
import ToastrError from "../components/common/ToastrError";

function Signin() {
  const getUser = localStorage.getItem("login-user");
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const isValid = () => {
    let isError = {};
    if (
      !/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(
        userDetail?.email
      )
    ) {
      isError.email = "Invalid email";
    }

    if (!/^[0-9]{4,}$/.test(userDetail?.password)) {
      isError.password = "Invalid password";
    }

    setError(isError);
    return Object.keys(isError).length ? false : true;
  };

  const handleChange = (key, value) => {
    setUserDetail((values) => ({ ...values, [key]: value }));
  };

  useEffect(() => {
    if (!getUser) {
      navigate(`/signin`);
    }
  }, [getUser]);

  const isExist = async () => {
    try {
      const checkData = await axios.get(
        `http://localhost:3001/userdetail?email=${userDetail.email}`
      );

      if (checkData?.data[0]?.email === userDetail?.email) {
        if (checkData?.data[0]?.password === userDetail?.password) {
          localStorage.setItem("login-user", checkData?.data[0]?.email);
          localStorage.setItem("user-id", checkData?.data[0]?.id);

          navigate("/blogs");
          ToastrSuccess({ successMessage: "Signed In!" });
        } else {
          window.alert("Incorrect password");
        }
      } else {
        window.alert("user not exist");
      }
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!isValid()) {
      isExist();
    }
  };

  return (
    <>
      <h1 className="heading">Sign In</h1>

      <div className="imgContainer">
        <img src={addProfile} alt="image" />
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div className="inputWithLabel">
            <input
              className="inputContainer"
              type="text"
              placeholder="Email"
              onChange={(e) => {
                handleChange("email", e?.target?.value);
              }}
            />
          </div>
          {error?.email && (
            <div className="invalidMessage"> {error?.email} </div>
          )}
          <div className="inputWithLabel">
            <input
              className="inputContainer"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                handleChange("password", e?.target?.value);
              }}
            />
          </div>
          {error?.password && (
            <div className="invalidMessage"> {error.password} </div>
          )}
          <div className="buttonContainer">
            <input type="submit" />
          </div>
        </form>
      </div>
      <div>
        <div className="otherPage">
          <Link to="/signup"> Don't have an Account? Sign Up </Link>
        </div>
      </div>
    </>
  );
}

export default Signin;
