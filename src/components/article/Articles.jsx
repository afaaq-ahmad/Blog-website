import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "toastr/build/toastr.min.css";
import { Link } from "react-router-dom";
import styles from "./articleStyle.module.css";
import ToastrError from "../common/ToastrError";
import Loader from "../loader/Loader";

const Articles = () => {
  const [articleData, setArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const navigate = useNavigate();
  const getArticleReq = async () => {
    try {
      const getArticles = await axios.get(`http://localhost:3001/articles/`);
      setArticleData(getArticles?.data);
    } catch (err) {
      return ToastrError({ errorMessage: err.message });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getArticleReq();
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.flexContainer}>
          <div className={styles.createArticleDiv}>
            <Link to={"/create-article"} className={styles.createArticleIcon}>
              Create new article
            </Link>
          </div>

          {articleData?.length > 0 &&
            articleData.map((article, i) => (
              <div key={i} className={styles.articleContainer}>
                <div
                  className={styles.eachArticle}
                  onClick={() => {
                    navigate(`/article/${article?.id}`);
                  }}
                >
                  <div className={styles.imageContainer}>
                    <img src={article?.image}></img>
                  </div>
                  <div className={styles.articleTitleContainer}>
                    <div className={styles.blogTitle}>
                      {article?.title.length < 40
                        ? article?.title
                        : article?.title.slice(0, 35) + "..."}
                    </div>
                    <div className={styles.dateStyle}>{article?.date}</div>
                    <div className={styles.descStyle}>
                      {article?.description.slice(0, 400) + "..."}
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
