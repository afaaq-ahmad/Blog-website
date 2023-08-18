import "./createblogstyle.css";
import "./SignupStyle.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";

const CreateArticle = () => {
  const { id } = useParams();
  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    date: "",
    modified_date: "",
    author: "",
    image: "",
  });
  const [error, setError] = useState({});

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
    setTimeout(() => toastr.success(`Articles list updated`, `Success!`), 300);
  };

  const articleNotify = () => {
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
    setTimeout(() => toastr.success(`Article updated`, `Success!`), 300);
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
  const getArticleRequest = async () => {
    try {
      const getReqToUpdate = await axios.get(
        `http://localhost:3001/articles/${id}`
      );
      setArticleData(getReqToUpdate?.data);
    } catch (err) {
      errorNotify();
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
        articleNotify();
        navigate(`/article/${id}`);
      } catch {
        errorNotify();
      }
    } else {
      try {
        articleData.date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.post(`http://localhost:3001/articles/`, articleData);
        notify();
        navigate(`/articles`);
      } catch {
        errorNotify();
      }
    }
  };

  const navigate = useNavigate();

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
