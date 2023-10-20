import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./postStyle.module.css";
import Loader from "../../loader/Loader";
import ToastrError from "../../common/ToastrError";
import ToastrSuccess from "../../common/ToastrSuccess";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { createTheme } from "@mui/material/styles";

const Post = () => {
  const { id } = useParams();
  const [blogPostData, setBlogPostData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getUserID = localStorage.getItem("user-id");

  const theme = createTheme({
    palette: {
      editColor: {
        main: "rgb(150,150,150)",
      },
    },
  });

  const getReq = async () => {
    try {
      const getData = await axios.get(`http://localhost:3001/blogs?id=${id}`);
      if (getData?.data?.length !== 0) {
        setBlogPostData(getData?.data[0]);
      } else {
        ToastrError({ errorMessage: "record not exist" });
      }
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };

  const deleteBlog = async () => {
    try {
      await axios.delete(`http://localhost:3001/blogs/${blogPostData?.id}`);
      navigate(`/blogs`);
      ToastrSuccess({ successMessage: "Blog Deleted!" });
    } catch (err) {
      ToastrError({ errorMessage: err.message });
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
            {!!blogPostData?.date && (
              <p>
                <b>Created on:</b> {blogPostData?.date}
              </p>
            )}
            {!!blogPostData?.modified_date && (
              <p>
                <b>Modified on:</b> {blogPostData?.modified_date}
              </p>
            )}
          </div>
          {blogPostData?.userID == getUserID && blogPostData?.title && (
            <div className={styles.buttonContainer}>
              <div className={styles.buttons}>
                <DeleteIcon
                  color="error"
                  sx={{
                    ":hover": {
                      transition: "200ms",
                      color: "rgb(168, 26, 26)",
                    },
                    cursor: "pointer",
                  }}
                  style={{
                    fontSize: "35px",
                    margin: "2px 10px",
                  }}
                  onClick={() => {
                    deleteBlog();
                  }}
                />

                <EditNoteIcon
                  theme={theme}
                  color="editColor"
                  sx={{
                    ":hover": {
                      transition: "200ms",
                      color: "rgb(100,100,100)",
                    },
                    cursor: "pointer",
                  }}
                  style={{
                    fontSize: "35px",
                    margin: "2px 10px",
                  }}
                  onClick={() => {
                    navigate(`/create-blog/${blogPostData?.id}`);
                  }}
                />
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
