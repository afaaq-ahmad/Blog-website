import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "toastr/build/toastr.min.css";
import { Link } from "react-router-dom";
import styles from "./articleStyle.module.css";
import ToastrError from "../common/ToastrError";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  getArticleList,
  selectArticleList,
  deleteArticleFromStore,
} from "../common/listSlice";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Checkbox from "@mui/material/Checkbox";

const Articles = () => {
  const [isLoading, setIsLoading] = useState();
  const dispatch = useDispatch();
  const articles = useSelector(selectArticleList);
  const navigate = useNavigate();
  const user_ID = localStorage.getItem("user-id");
  const [checkedArticles, setCheckedArticles] = useState([]);
  const checkBoxes = document.getElementsByName("chkbox");
  const [usersAllArticles, setUsersAllArticles] = useState([]);
  const [checkboxAll, setCheckboxAll] = useState(false);
  const theme = createTheme({
    palette: {
      greenishBlue: {
        main: "#55bebb",
      },
    },
  });

  const getArticleReq = async () => {
    try {
      const getArticles = await axios.get(`http://localhost:3001/articles/`);
      dispatch(getArticleList(getArticles?.data));
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };

  const getUsersAllArticles = () => {
    const arr = [];
    articles?.map((article) => {
      if (user_ID === article?.userID) {
        arr.push(article?.id);
      }
    });
    setUsersAllArticles(arr);
  };

  useEffect(() => {
    setIsLoading(true);
    getArticleReq();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    getUsersAllArticles();
  }, [articles]);

  const handleCheckbox = (event, value) => {
    event.stopPropagation();
    const arr = [...checkedArticles];
    if (!!checkedArticles?.includes(value)) {
      let index = checkedArticles?.indexOf(value);
      arr?.splice(index, 1);
      setCheckboxAll(false);
    } else {
      arr?.push(value);

      if (usersAllArticles?.length === arr?.length) {
        setCheckboxAll(true);
      }
    }

    setCheckedArticles(arr);
  };

  const deleteArticles = () => {
    checkBoxes[0] = false;
    const tempArr = [];
    const delAnArticle = async (index) => {
      try {
        const isDeleted = await axios?.delete(
          `http://localhost:3001/articles/${index}`
        );
        isDeleted.status === 200 && dispatch(deleteArticleFromStore(index));
      } catch (err) {
        ToastrError({ errorMessage: err?.message });
      }
    };

    checkedArticles?.map((articleID) => {
      delAnArticle(articleID);
    });
    setCheckedArticles([]);
  };

  const selectAll = () => {
    if (!checkboxAll) {
      setCheckboxAll(true);
      for (let i = 0; i < checkBoxes?.length; i++) {
        checkBoxes[i].checked = true;
      }
      const arr = [];
      setCheckedArticles([]);
      articles?.map((article) => {
        if (user_ID === article?.userID) {
          arr.push(article?.id);
        }
      });
      setCheckedArticles(arr);
    } else {
      setCheckboxAll(false);
      for (let i = 0; i < checkBoxes?.length; i++) {
        checkBoxes[i].checked = false;
      }
      setCheckedArticles([]);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.flexContainer}>
          <div className={styles.createArticleDiv}>
            <div className={styles?.iconContainer}>
              {checkedArticles?.length > 0 && (
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  style={{ fontSize: "12px", margin: "2px 7px" }}
                  onClick={() => deleteArticles()}
                >
                  Delete
                </Button>
              )}
              {checkedArticles?.length == 1 && (
                <Button
                  theme={theme}
                  variant="contained"
                  size="small"
                  color="greenishBlue"
                  sx={{
                    ":hover": {
                      backgroundColor: "#33b5b1",
                    },
                  }}
                  style={{
                    fontSize: "12px",
                    margin: "2px 7px",
                    color: "white",
                  }}
                  onClick={() => {
                    localStorage.setItem("from articles", true);
                    navigate(`/create-article/${checkedArticles[0]}`);
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
            {usersAllArticles?.length > 0 && (
              <Checkbox
                checked={checkboxAll}
                name="selectAllCheckBox"
                className={styles.checkboxAllStyle}
                onClick={() => {
                  selectAll();
                }}
              />
            )}
            <div>
              <AddCircleOutlineOutlinedIcon
                sx={{ fontSize: 40 }}
                className={styles.createArticleText}
                onClick={() => {
                  navigate(`/create-article`);
                }}
              />
            </div>
          </div>

          {articles?.length > 0 &&
            articles?.map((article, i) => (
              <div key={i} className={styles.articleContainer}>
                <div
                  className={styles.eachArticle}
                  onClick={() => {
                    localStorage.removeItem("from articles");
                    navigate(`/article/${article?.id}`);
                  }}
                >
                  <div className={styles?.imageContainer}>
                    <img src={article.image} alt="Article"></img>
                    {article?.userID === user_ID && (
                      <input
                        type="checkbox"
                        name="chkbox"
                        className={styles?.checkStyle}
                        onClick={(e) => handleCheckbox(e, article?.id)}
                      />
                    )}
                  </div>
                  <div className={styles.articleTitleContainer}>
                    <div className={styles.blogTitle}>
                      {article?.title?.length < 40
                        ? article?.title
                        : article?.title.slice(0, 35) + "..."}
                    </div>
                    <div className={styles.dateStyle}>{article?.date}</div>
                    <div className={styles.descStyle}>
                      {article?.description?.length < 400
                        ? article?.description
                        : article?.description.slice(0, 400) + "..."}
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

export default Articles;
