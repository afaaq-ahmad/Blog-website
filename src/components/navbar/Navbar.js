import { useNavigate } from "react-router-dom";
import "./navbarStyle.css";
import logo from "../../images/logo-no-background.png";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const navigate = useNavigate();

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
