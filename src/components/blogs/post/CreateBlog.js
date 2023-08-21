import "./createblogstyle.css";
import "../../../signup/SignupStyle.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import ToastrError from "../../common/ToastrError";
import ToastrSuccess from "../../common/ToastrSuccess";

const CreateBlog = () => {
  const { id } = useParams();
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    date: "",
    modified_date: "",
    author: "",
    image: "",
  });

  const getBlogContent = async () => {
    try {
      const getReqToUpdate = await axios.get(
        `http://localhost:3001/blogs/${id}`
      );
      setBlogData(getReqToUpdate?.data);
    } catch (err) {
      return ToastrError({ errorMessage: err.message });
    }
  };

  useEffect(() => {
    if (!!id) {
      getBlogContent();
    }
  }, [id]);

  const postBlog = async () => {
    let dt = new Date();

    if (!!id) {
      try {
        blogData.modified_date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.put(`http://localhost:3001/blogs/${id}`, blogData);
        navigate(`/blog/${id}`);
        return ToastrSuccess({ successMessage: "Blog Updated!" });
      } catch (err) {
        return ToastrError({ errorMessage: err.message });
      }
    } else {
      try {
        blogData.date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.post(`http://localhost:3001/blogs/`, blogData);
        navigate(`/blogs`);
        return ToastrSuccess({ successMessage: "Blog Created!" });
      } catch (err) {
        return ToastrError({ errorMessage: err.message });
      }
    }
  };

  const validated = () => {
    const checkError = {};
    if (blogData?.title === "") {
      checkError.title = "Title cannot be empty";
    }
    if (blogData?.description === "") {
      checkError.description = "Description cannot be empty";
    }
    if (blogData?.author === "") {
      checkError.author = "Author name cannot be empty";
    }

    if (blogData?.image === "") {
      checkError.image = "Please upload an image";
    }

    setError(checkError);
    return Object?.keys(checkError)?.length > 0 ? false : true;
  };

  const handleChangeBlog = (name, value) => {
    setBlogData((values) => ({ ...values, [name]: value }));
  };

  const checkImage = (val) => {
    const reader = new FileReader();
    reader.readAsDataURL(val);
    reader.onload = () => {
      setBlogData((values) => ({ ...values, image: reader.result }));
    };
  };

  const publishBlog = () => {
    if (!!validated()) {
      postBlog();
    }
  };
  return (
    <>
      <h1 className="createBlogTitle">Enter blog details</h1>

      <div className="create_blog_form">
        <input
          type="text"
          placeholder="Title"
          className="blog_input"
          value={blogData?.title}
          onChange={(e) => {
            handleChangeBlog("title", e?.target?.value);
          }}
        />

        {error?.title && (
          <div className="invalidMessageBlog ">{error?.title}</div>
        )}
        <textarea
          placeholder="Enter Description"
          rows={10}
          className="blog_textarea"
          value={blogData?.description}
          onChange={(e) => {
            handleChangeBlog("description", e?.target?.value);
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
            <img src={blogData?.image}></img>
          </div>
        </div>

        {error?.image && (
          <div className="invalidMessageBlog ">{error?.image}</div>
        )}

        <input
          type="text"
          placeholder="Author"
          value={blogData?.author}
          className="blog_input"
          onChange={(e) => {
            handleChangeBlog("author", e?.target?.value);
          }}
        />
        {error?.author && (
          <div className="invalidMessageBlog ">{error?.author}</div>
        )}
        <input
          type="submit"
          value="Publish"
          className="publish_button"
          onClick={publishBlog}
        />
      </div>
    </>
  );
};

export default CreateBlog;
