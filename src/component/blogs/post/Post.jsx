import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./postStyle.module.css";
import Loader from "../../loader/Loader";
import toastr from "toastr";

const Post = () => {
  const { id } = useParams();
  const [blogPostData, setBlogPostData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const notify = () => {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      onclick: null,
      showDuration: "200",
      hideDuration: "500",
      timeOut: "3000",
      extendedTimeOut: "500",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    toastr.clear();
    setTimeout(() => toastr.success(`Blog removed`, `Success!`), 300);
  };

  const getReq = async () => {
    try {
      const getData = await axios.get(`http://localhost:3001/blogs?id=${id}`);
      setBlogPostData(getData?.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThis = async () => {
    try {
      await axios.delete(`http://localhost:3001/blogs/${blogPostData?.id}`);
      notify();
      navigate(`/blogs`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      getReq();
    }, 1000);
  }, [id]);

  // console.log(blogPostData);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles?.flexContainer}>
          <div
            className={styles?.postPageTitle}
            style={{
              minHeight: "100%",
              background: `center / cover no-repeat url(${blogPostData?.image})`,
              boxShadow: "inset 0 0 0 150px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h1>{blogPostData?.title}</h1>
          </div>
          <div className={styles?.blogDate}>
            <p>{blogPostData?.date}</p>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.buttons}>
              <div
                className={styles.delete}
                onClick={() => {
                  deleteThis();
                }}
              >
                Delete
              </div>
              <div
                className={styles.edit}
                onClick={() => {
                  navigate(`/create-blog/${blogPostData?.id}`);
                }}
              >
                Edit
              </div>
            </div>
          </div>
          <div className={styles?.blogDesc}>
            <p>{blogPostData?.description}</p>
          </div>
          <div className={styles.imageContainer}>
            <img src={blogPostData?.image} alt=""></img>
          </div>
          <div className={styles?.authorContainer}>
            <p>{blogPostData?.author}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;