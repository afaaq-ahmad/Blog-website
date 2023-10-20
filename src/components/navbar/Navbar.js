import { useNavigate } from "react-router-dom";
import "./navbarStyle.css";
import logo from "../../images/logo-no-background.png";
import SearchIcon from "@mui/icons-material/Search";
import { Switch } from "@mui/material";
import { changeTheme } from "../common/listSlice";
import { useDispatch } from "react-redux";
const label = { inputProps: { "area-label": "switch-demo" } };

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoginPage = localStorage.getItem("login-user");

  return (
    <>
      <div className="navbarContainer">
        <div className="navbarTitle">
          <img
            className="navbarLogo"
            src={logo}
            onClick={() => {
              navigate(`/blogs`);
            }}
          ></img>
        </div>

        <div className="rightSideNavbar">
          <Switch
            {...label}
            sx={{ margin: "2px 5px" }}
            onChange={() => {
              dispatch(changeTheme());
            }}
          />
          {isLoginPage?.length > 0 && (
            // <div
            //   className="navbarPageLinks"
            //   onClick={() => {
            //     navigate(`/search`);
            //   }}
            // >
            //   Search
            // </div>
            <SearchIcon
              sx={{
                color: "white",
                cursor: "pointer",
                margin: "2px 5px",
              }}
              onClick={() => {
                navigate(`/search`);
              }}
            />
          )}
          {isLoginPage?.length > 0 && (
            <div
              className="navbarPageLinks"
              onClick={() => {
                navigate(`/articles`);
              }}
            >
              Articles
            </div>
          )}
          {isLoginPage?.length > 0 && (
            <div
              className="navbarPageLinks"
              onClick={() => {
                navigate(`/blogs`);
              }}
            >
              Blogs
            </div>
          )}
          {isLoginPage?.length > 0 && (
            <div
              className="signinButton"
              onClick={() => {
                localStorage.clear();
                navigate(`/signin`);
              }}
            >
              Sign out
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
