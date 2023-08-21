import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./signup/Signup";
import Signin from "./signin/Signin";
import Home from "./home/Home";
import CreateBlog from "./component/blogs/post/CreateBlog";
import Navbar from "./component/navbar/Navbar";
import Layout from "./component/common/Layout";
import Post from "./component/blogs/post/Post";
import Articles from "./component/article/Articles";
import CreateArticle from "./component/article/CreateArticle";
import ArticlePost from "./component/article/ArticlePost";
import Search from "./component/search/Search";
import PageNotExist from "./component/page_not_exist/PageNotExist";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<Layout />}>
          <Route path="/blogs" element={<Home />} />
          <Route path="/create-blog/:id" element={<CreateBlog />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/article/:id" element={<ArticlePost />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/create-article/:id" element={<CreateArticle />} />
          <Route path="/search" element={<Search />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/*" element={<PageNotExist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
