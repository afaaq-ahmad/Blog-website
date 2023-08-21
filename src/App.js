import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./signup/Signup";
import Signin from "./signin/Signin";
import Home from "./home/Home";
import CreateBlog from "./components/blogs/post/CreateBlog";
import Navbar from "./components/navbar/Navbar";
import Layout from "./components/common/Layout";
import Post from "./components/blogs/post/Post";
import Articles from "./components/article/Articles";
import CreateArticle from "./components/article/CreateArticle";
import ArticlePost from "./components/article/ArticlePost";
import Search from "./components/search/Search";
import PageNotExist from "./components/page_not_exist/PageNotExist";

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
