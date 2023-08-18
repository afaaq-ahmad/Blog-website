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

  const getReq = async () => {
    try {
      const getData = await axios.get(`http://localhost:3001/blogs?id=${id}`);
      setBlogPostData(getData?.data[0]);
    } catch {
      errorNotify();
    }
  };

  const deleteThis = async () => {
    try {
      await axios.delete(`http://localhost:3001/blogs/${blogPostData?.id}`);
      notify();
      navigate(`/blogs`);
    } catch (err) {
      errorNotify();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      getReq();
    }, 1000);
  }, [id]);
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
            {blogPostData?.date && (
              <p>
                <b>Created on:</b> {blogPostData?.date}
              </p>
            )}
            {blogPostData?.modified_date && (
              <p>
                <b>Modified on:</b> {blogPostData?.modified_date}
              </p>
            )}
          </div>
          {blogPostData?.title && (
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
          )}
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
