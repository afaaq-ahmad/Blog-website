import "../blogs/post/createblogstyle.css";
import "../../signup/SignupStyle.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import ToastrError from "../common/ToastrError";
import ToastrSuccess from "../common/ToastrSuccess";

const CreateArticle = () => {
  const { id } = useParams();
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const user_ID = localStorage.getItem("user-id");

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    date: "",
    modified_date: "",
    author: "",
    image: "",
    userID: user_ID,
  });

  const getArticleRequest = async () => {
    try {
      const getReqToUpdate = await axios.get(
        `http://localhost:3001/articles/${id}`
      );
      setArticleData(getReqToUpdate?.data);
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };
  useEffect(() => {
    if (!!id) {
      getArticleRequest();
    }
  }, []);

  const postArticle = async () => {
    let dt = new Date();

    if (!!id) {
      try {
        articleData.modified_date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.put(`http://localhost:3001/articles/${id}`, articleData);
        if (localStorage.getItem("from articles")) {
          navigate(`/articles`);
        } else {
          navigate(`/article/${id}`);
        }
        ToastrSuccess({ successMessage: "Article updated!" });
      } catch (err) {
        ToastrError({ errorMessage: err.message });
      }
    } else {
      setArticleData((values) => ({ ...values, userID: user_ID }));
      try {
        articleData.date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.post(`http://localhost:3001/articles/`, articleData);
        navigate(`/articles`);
        ToastrSuccess({ successMessage: "Article Created!" });
      } catch (err) {
        ToastrError({ errorMessage: err.message });
      }
    }
  };

  const validated = () => {
    const checkError = {};
    if (articleData?.title === "") {
      checkError.title = "Title cannot be empty";
    }
    if (articleData?.description === "") {
      checkError.description = "Description cannot be empty";
    }
    if (articleData?.author === "") {
      checkError.author = "Author name cannot be empty";
    }

    if (articleData?.image === "") {
      checkError.image = "Please upload an image";
    }

    setError(checkError);
    return Object?.keys(checkError)?.length > 0 ? false : true;
  };

  const handleChangeArticle = (name, value) => {
    setArticleData((values) => ({ ...values, [name]: value }));
  };

  const checkImage = (val) => {
    const reader = new FileReader();
    reader.readAsDataURL(val);
    reader.onload = () => {
      setArticleData((values) => ({ ...values, image: reader.result }));
    };
  };

  const publishArticle = () => {
    if (!!validated()) {
      postArticle();
    }
  };
  return (
    <>
      <h1 className="createBlogTitle">Enter article details</h1>
      <div className="create_blog_form">
        <input
          type="text"
          placeholder="Title"
          className="blog_input"
          value={articleData?.title}
          onChange={(e) => {
            handleChangeArticle("title", e?.target?.value);
          }}
        />

        {error?.title && (
          <div className="invalidMessageBlog ">{error?.title}</div>
        )}
        <textarea
          placeholder="Enter Description"
          rows={10}
          className="blog_textarea"
          value={articleData?.description}
          onChange={(e) => {
            handleChangeArticle("description", e?.target?.value);
          }}
        />

        {error?.description && (
          <div className="invalidMessageBlog ">{error?.description}</div>
        )}

        <div className="blog_input uploadFile">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="uploadFileItem"
            onChange={(e) => {
              checkImage(e.target.files[0]);
            }}
          />
          <div className="imagePreview">
            <img src={articleData?.image}></img>
          </div>
        </div>

        {error?.image && (
          <div className="invalidMessageBlog ">{error?.image}</div>
        )}

        <input
          type="text"
          placeholder="Author"
          value={articleData?.author}
          className="blog_input"
          onChange={(e) => {
            handleChangeArticle("author", e?.target?.value);
          }}
        />

        {error?.author && (
          <div className="invalidMessageBlog ">{error?.author}</div>
        )}
        <input
          type="submit"
          value="Publish"
          className="publish_button"
          onClick={publishArticle}
        />
      </div>
    </>
  );
};

export default CreateArticle;
