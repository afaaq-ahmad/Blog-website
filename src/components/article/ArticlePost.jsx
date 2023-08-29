import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../blogs/post/postStyle.module.css";
import Loader from "../loader/Loader";
import ToastrError from "../common/ToastrError";
import ToastrSuccess from "../common/ToastrSuccess";

const ArticlePost = () => {
  const { id } = useParams();
  const [articlePostData, setArticlePostData] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const getUserID = localStorage.getItem("user-id");

  const getReq = async () => {
    try {
      const getData = await axios.get(
        `http://localhost:3001/articles?id=${id}`
      );
      setArticlePostData(getData?.data[0]);
    } catch (err) {
      return ToastrError({ errorMessage: err.message });
    }
  };

  const deleteThis = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/articles/${articlePostData?.id}`
      );
      navigate(`/articles`);
      ToastrSuccess({ sucessMessage: "Article deleted" });
    } catch (err) {
      return ToastrError({ errorMessage: err.message });
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
            {articlePostData?.date && (
              <p>
                <b>Created on: </b>
                {articlePostData?.date}
              </p>
            )}
            {!!articlePostData?.modified_date && (
              <p>
                <b>Modified on: </b>
                {articlePostData?.modified_date}
              </p>
            )}
          </div>
          {articlePostData?.userID == getUserID && !!articlePostData?.title && (
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
          )}
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
