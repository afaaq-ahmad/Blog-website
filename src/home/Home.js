import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
import "toastr/build/toastr.min.css";
import styles from "./home.module.css";
import ToastrError from "../components/common/ToastrError";
import { useDispatch, useSelector } from "react-redux";
import { getBlogList, selectBlogList } from "../components/common/listSlice";
import bin from "../images/delete_FILL0_wght300_GRAD0_opsz24.png";
import edit from "../images/edit_note_FILL0_wght300_GRAD0_opsz24 (1).png";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogList);
  const user_ID = localStorage.getItem("user-id");
  const [checkedBlogs, setCheckedBlogs] = useState([]);
  let arr;

  const getBlogObj = async () => {
    try {
      const getBlog = await axios?.get(`http://localhost:3001/blogs/`);
      dispatch(getBlogList(getBlog?.data));
      setCheckedBlogs([]);
    } catch (err) {
      console.log("working");
      ToastrError({ errorMessage: err.message });
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setTimeout(() => {
      getBlogObj();
      setIsLoading(true);
    }, 500);
  }, []);

  const handleCheckbox = (value) => {
    arr = [...checkedBlogs];
    if (!!checkedBlogs?.includes(value)) {
      let index = checkedBlogs?.indexOf(value);
      arr?.splice(index, 1);
    } else {
      arr?.push(value);
    }
    setCheckedBlogs(arr);
  };

  const delBlogs = () => {
    const tempArr = [];
    const del = async (blogIndex) => {
      try {
        const xyz = await axios.delete(
          `http://localhost:3001/blogs/${blogIndex}`
        );
        xyz.status === 200 && tempArr?.push(blogIndex);
      } catch (err) {
        ToastrError({ errorMessage: err?.message });
      }
    };

    checkedBlogs?.map((blogIndex) => {
      del(blogIndex);
    });
    tempArr?.length === checkedBlogs?.length && getBlogObj();
    window.location.reload(true);
  };

  return (
    <>
      {!isLoading ? (
        <Loader />
      ) : (
        <div className={styles?.flexContainer}>
          <div className={styles?.createBlogDiv}>
            <div className={styles?.iconContainer}>
              {checkedBlogs?.length > 0 && (
                <div className={styles?.delIcon} onClick={() => delBlogs()}>
                  <img src={bin} />
                </div>
              )}
              {checkedBlogs?.length == 1 && (
                <div
                  onClick={() => {
                    localStorage.setItem("from blogs", true);
                    navigate(`/create-blog/${checkedBlogs[0]}`);
                  }}
                >
                  <img src={edit} className={styles?.editIcon} />
                </div>
              )}
            </div>

            <div>
              <Link to={"/create-blog"} className={styles?.createBlogText}>
                Create new blog
              </Link>
            </div>
          </div>

          {blogs?.length > 0 &&
            blogs?.map((blog, i) => (
              <div key={i} className={styles?.blogContainer}>
                {blog?.userID == user_ID && (
                  <input
                    type="checkbox"
                    className={styles?.checkStyle}
                    onClick={() => handleCheckbox(blog?.id)}
                  />
                )}

                <div
                  className={styles?.eachBlog}
                  onClick={() => {
                    navigate(`/blog/${blog?.id}`);
                  }}
                >
                  <div className={styles?.imageContainer}>
                    <img src={blog.image}></img>
                  </div>
                  <div className={styles?.blogTitleContainer}>
                    <div className={styles?.blogTitle}>
                      {blog.title.length < 40
                        ? blog.title
                        : blog.title.slice(0, 35) + "..."}
                    </div>
                    <div className={styles?.dateStyle}>{blog?.date}</div>
                    <div className={styles?.descStyle}>
                      {blog?.description.slice(0, 400) + "..."}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Home;
