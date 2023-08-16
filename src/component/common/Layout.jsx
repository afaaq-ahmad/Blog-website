import React from "react";
import Signin from "../../Signin";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const getUser = localStorage.getItem("login-user");

  return <div>{!!getUser ? <Outlet /> : <Signin />}</div>;
};

export default Layout;
