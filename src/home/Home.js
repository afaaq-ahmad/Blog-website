import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import bin from "../images/delete_FILL0_wght300_GRAD0_opsz24.png";
import edit from "../images/edit_note_FILL0_wght300_GRAD0_opsz24 (1).png";
import { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import styles from "./home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [blogObject, setBlogObject] = useState([]);

  // const notify = () => {
  //   toastr.options = {
  //     closeButton: false,
  //     debug: false,
  //     newestOnTop: false,
  //     progressBar: false,
  //     positionClass: "toast-top-right",
  //     preventDuplicates: false,
  //     onclick: null,
  //     showDuration: "300",
  //     hideDuration: "1000",
  //     timeOut: "5000",
  //     extendedTimeOut: "1000",
  //     showEasing: "swing",
  //     hideEasing: "linear",
  //     showMethod: "fadeIn",
  //     hideMethod: "fadeOut",
  //   };
  //   toastr.clear();
  //   setTimeout(() => toastr.success(`Blog removed`, `Success!`), 300);
  // };

  const getBlogObj = async () => {
    try {
      const getBlog = await axios?.get(`http://localhost:3001/blogs/`);
      setBlogObject(getBlog?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlogObj();
  }, []);

  const deleteOp = async (blogId) => {
    try {
      await axios.delete(`http://localhost:3001/blogs/${blogId}`);
      // console.log(delReq);
      // notify();
      getBlogObj();
    } catch {}
  };

  console.log("blogObject", blogObject);

  return (
    <>
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
    </>
  );
};

export default Home;

{
  /* <div className={styles.postWithIcons}>
  <div
    onClick={() => navigate(`/blog/${blog?.id}`)}
    className={styles.postTitleContainer}
  >
    <div className={styles.postTitle}>{blog?.title}</div>
  </div>
  <div className={styles.postIcons}>
    <div>
      <img
        src={bin}
        alt="bin"
        className={styles.deleteIcon}
        onClick={() => {
          deleteOp(blog?.id);
        }}
      />
    </div>
    <div onClick={() => navigate(`/create-blog/${blog?.id}`)}>
      <img src={edit} className={styles.editIcon}></img>
    </div>
  </div>
</div>; */
}
