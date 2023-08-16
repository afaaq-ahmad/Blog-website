import { useEffect, useState } from "react";
import "./searchStyle.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchBlogData, setSearchBlogData] = useState([]);
  const [inputData, setInputData] = useState("");
  const [searchArticleData, setSearchArticleData] = useState([]);
  const navigate = useNavigate();

  let blogFound = false;
  let articleFound = false;
  useEffect(() => {
    const getForSearch = async () => {
      try {
        const getBlogs = await axios?.get(`http://localhost:3001/blogs/`);
        const getArticles = await axios?.get(`http://localhost:3001/articles/`);
        setSearchBlogData(getBlogs?.data);
        setSearchArticleData(getArticles?.data);
      } catch (err) {
        console.log(err);
      }
    };

    getForSearch();
  }, []);

  console.log("input data", inputData);
  console.log("search blog", searchBlogData);
  console.log("search article", searchArticleData);
  return (
    <>
      <div className="searchFlexContainer">
        <div className="searchTitle">
          <h1>Search by title</h1>
        </div>
        <div className="searchInputContainer">
          <input
            type="text"
            onChange={(e) => {
              setInputData(e?.target?.value);
            }}
          />
        </div>
        <div>
          <h1>Blogs</h1>
        </div>
        {searchBlogData?.length > 0 &&
          searchBlogData
            ?.filter((el) =>
              el?.title?.toLowerCase()?.includes(inputData?.toLowerCase())
            )
            ?.map((blog, i) => (
              <div
                key={i}
                className="searchedTitleContainer"
                onClick={() => {
                  navigate(`/blog/${blog?.id}`);
                }}
              >
                <div className="searchedTitleDiv">
                  {(blogFound = true)}
                  <div>{blog?.title}</div>
                </div>
              </div>
            ))}

        {!blogFound && <div>No blog title matched with "{`${inputData}`}"</div>}
        <div>
          <h1>Articles</h1>
        </div>

        {searchArticleData?.length > 0 &&
          searchArticleData
            ?.filter((el) =>
              el?.title?.toLowerCase()?.includes(inputData?.toLowerCase())
            )
            ?.map((article, i) => (
              <div
                key={i}
                className="searchedTitleContainer"
                onClick={() => {
                  navigate(`/article/${article?.id}`);
                }}
              >
                <div className="searchedTitleDiv">
                  {(articleFound = true)}
                  <div>{article?.title}</div>
                </div>
              </div>
            ))}
        {!articleFound && (
          <div>No article title matched with "{`${inputData}`}"</div>
        )}
      </div>
    </>
  );
};

export default Search;
