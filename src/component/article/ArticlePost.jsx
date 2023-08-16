import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../blogs/post/postStyle.module.css";
import Loader from "../loader/Loader";
import toastr from "toastr";

const ArticlePost = () => {
  const { id } = useParams();
  const [articlePostData, setArticlePostData] = useState({});
  const [isLoading, setIsloading] = useState(false);
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
    setTimeout(() => toastr.success(`Article removed`, `Success!`), 300);
  };

  const getReq = async () => {
    try {
      const getData = await axios.get(
        `http://localhost:3001/articles?id=${id}`
      );
      setArticlePostData(getData?.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThis = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/articles/${articlePostData?.id}`
      );
      notify();
      navigate(`/articles`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsloading(true);
    setTimeout(() => {
      getReq();
      setIsloading(false);
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
              background: `center / cover no-repeat url(${articlePostData?.image})`,
              boxShadow: "inset 0 0 0 150px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h1>{articlePostData?.title}</h1>
          </div>
          <div className={styles?.blogDate}>
            <p>{articlePostData?.date}</p>
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
                  navigate(`/create-article/${articlePostData?.id}`);
                }}
              >
                Edit
              </div>
            </div>
          </div>
          <div className={styles?.blogDesc}>
            <p>{articlePostData?.description}</p>
          </div>
          <div className={styles.imageContainer}>
            <img src={articlePostData?.image} alt=""></img>
          </div>
          <div className={styles?.authorContainer}>
            <p>{articlePostData?.author}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlePost;
