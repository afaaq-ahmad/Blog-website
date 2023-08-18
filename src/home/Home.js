import { Link, useNavigate } from "react-router-dom";
import Loader from "../component/loader/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
import "toastr/build/toastr.min.css";
import styles from "./home.module.css";
import toastr from "toastr";

const Home = () => {
  const navigate = useNavigate();
  const [blogObject, setBlogObject] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const errorNotify = () => {
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      onclick: null,
      showDuration: "5000",
      hideDuration: "1000",
      timeOut: "3000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    toastr.clear();
    setTimeout(() => toastr.error("Server not found", "Error"), 1000);
  };

  const getBlogObj = async () => {
    try {
      const getBlog = await axios?.get(`http://localhost:3001/blogs/`);
      setBlogObject(getBlog?.data);
    } catch (err) {
      errorNotify();
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setTimeout(() => {
      getBlogObj();
      setIsLoading(true);
    }, 500);
  }, []);

  return (
    <>
      {!isLoading ? (
        <Loader />
      ) : (
        <div className={styles.flexContainer}>
          <div className={styles.createBlogDiv}>
            <Link to={"/create-blog"} className={styles.createBlogIcon}>
              Create new blog
            </Link>
          </div>

          {blogObject?.length > 0 &&
            blogObject.map((blog, i) => (
              <div key={i} className={styles.blogContainer}>
                <div
                  className={styles.eachBlog}
                  onClick={() => {
                    navigate(`/blog/${blog?.id}`);
                  }}
                >
                  <div className={styles.imageContainer}>
                    <img src={blog.image}></img>
                  </div>
                  <div className={styles.blogTitleContainer}>
                    <div className={styles.blogTitle}>
                      {blog.title.length < 40
                        ? blog.title
                        : blog.title.slice(0, 35) + "..."}
                    </div>
                    <div className={styles.dateStyle}>{blog?.date}</div>
                    <div className={styles.descStyle}>
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
