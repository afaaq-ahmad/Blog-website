import { useDebugValue, useEffect, useState } from "react";
import "./SignupStyle.css";
import profile from "../images/add_3971443.png";
import { Link, useNavigate } from "react-router-dom";
import ToastrSuccess from "../components/common/ToastrSuccess";
import ToastrError from "../components/common/ToastrError";

function Signup() {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [emailExist, setEmailExist] = useState(null);
  const [userDetail, setUserDetail] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    gender: "male",
    password: "",
  });

  const handleChange = (name, value) => {
    setUserDetail((values) => ({ ...values, [name]: value }));
  };

  const isValid = () => {
    let isError = {};

    if (!/^[A-Za-z][a-z]{1,19}$/.test(userDetail?.firstName)) {
      isError.firstName = "First name should only contain upto 20 literals";
    }

    if (!/^[A-Za-z][a-z]{1,19}$/.test(userDetail?.lastName)) {
      isError.lastName = "Last name should only contain upto 20 literals";
    }

    if (!/^(?:[1-9]|[1-9][0-9])$/.test(userDetail?.age)) {
      isError.age = "Age should ranges from 1-99 years";
    }

    if (
      !/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(
        userDetail?.email
      )
    ) {
      isError.email = "Enter a valid email";
    }

    if (
      // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      !/^[0-9]{4,}$/.test(userDetail?.password)
    ) {
      isError.password = "Invalid password format";
    }
    setError(isError);

    return Object.keys(isError)?.length > 0 ? false : true;
  };

  const postReq = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/userexist/${userDetail?.email}`
      );

      response.json().then((res) => {
        if (res.length > 0) {
          setEmailExist(true);
        } else {
          setEmailExist(false);
        }
      });
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };

  useEffect(() => {
    if (emailExist === false) {
      try {
        fetch("http://localhost:3005/createuser/", {
          method: `POST`,
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ userDetail }),
        });
        ToastrSuccess({ successMessage: "User created!" });
        navigate("/signin");
      } catch (err) {
        ToastrError({ errorMessage: err?.message });
      }
    } else if (emailExist === true) {
      ToastrError({ errorMessage: "user already exist" });
    }
  }, [emailExist]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const check = isValid();
    if (!!check) {
      postReq();
    }
  };

  return (
    <>
      <h1 className="heading">Sign Up</h1>

      <div className="imgContainer">
        <img src={profile} alt="profile" />
      </div>

      <div className="flexContainer">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <div className="inputWithLabel">
              <input
                className="inputContainer"
                type="text"
                placeholder="First Name"
                value={userDetail.firstName}
                onChange={(e) => handleChange("firstName", e?.target?.value)}
              />
            </div>
            {error?.firstName && (
              <div className="invalidMessage">{error?.firstName}</div>
            )}

            <div className="inputWithLabel">
              <input
                className="inputContainer"
                type="text"
                placeholder="Last Name"
                value={userDetail.lastName}
                onChange={(e) => handleChange("lastName", e?.target?.value)}
              />
            </div>

            {error?.lastName && (
              <div className="invalidMessage">{error?.lastName}</div>
            )}

            <div className="inputWithLabel">
              <input
                className="inputContainer"
                type="text"
                placeholder="Age"
                value={userDetail.age}
                onChange={(e) => handleChange("age", e?.target?.value)}
              />
            </div>

            {error?.age && <div className="invalidMessage">{error?.age}</div>}

            <div className="radioContainer">
              <div>
                <label className="radioInput">
                  <input
                    type="radio"
                    checked={userDetail?.gender === "male" ? true : false}
                    onChange={() => handleChange("gender", "male")}
                  />
                  Male
                </label>
                <label className="radioInput">
                  <input
                    type="radio"
                    checked={userDetail?.gender === "female"}
                    onChange={(e) => handleChange("gender", "female")}
                  />
                  Female
                </label>
              </div>
            </div>

            <div className="inputWithLabel">
              <input
                className="inputContainer"
                type="text"
                placeholder="Email"
                value={userDetail.email}
                onChange={(e) => handleChange("email", e?.target?.value)}
              />
            </div>

            {error?.email && (
              <div className="invalidMessage">{error?.email}</div>
            )}

            <div className="inputWithLabel">
              <input
                className="inputContainer"
                type="text"
                placeholder="Choose Password"
                value={userDetail.password}
                onChange={(e) => handleChange("password", e?.target?.value)}
              />
            </div>

            {error?.age && (
              <div className="invalidMessage">{error?.password}</div>
            )}

            <div className="buttonContainer">
              <input type="submit" />
            </div>
          </form>
        </div>
        <div className="otherPageContainer">
          <div className="otherPage">
            <Link to="/signin">Already have an account? Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
