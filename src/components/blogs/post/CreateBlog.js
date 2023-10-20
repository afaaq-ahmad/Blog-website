import "./createblogstyle.css";
import "../../../signup/SignupStyle.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ToastrError from "../../common/ToastrError";
import ToastrSuccess from "../../common/ToastrSuccess";

const CreateBlog = () => {
  const { id } = useParams();
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const user_ID = localStorage.getItem("user-id");
  const [imagePreview, setPreviewImage] = useState(null);
  const [blogData, setBlogData] = useState([
    {
      title: "",
      description: "",
      date: "",
      modified_date: "",
      author: "",
      image: null,
      image_name: "",
      previousImage: undefined,
      userID: user_ID,
    },
  ]);

  const getBlogContent = async () => {
    try {
      const getReqToUpdate = await axios.get(
        `http://localhost:3005/createblog/${id}`
      );
      setBlogData(getReqToUpdate?.data);
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };

  useEffect(() => {
    if (!!id) {
      getBlogContent();
    }
  }, [id]);

  useEffect(() => {
    setPreviewImage(blogData[0].image);
  }, [blogData]);

  const postBlog = async () => {
    let dt = new Date();

    if (!!id) {
      try {
        blogData[0].modified_date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.put(`http://localhost:3005/createblog/${id}`, blogData[0]);
        if (localStorage.getItem("from blogs")) {
          navigate(`/blogs`);
        } else {
          navigate(`/blog/${id}`);
        }

        ToastrSuccess({ successMessage: "Blog Updated!" });
      } catch (err) {
        ToastrError({ errorMessage: err.message });
      }
    } else {
      setBlogData((values) => ({ ...values, userID: user_ID }));
      try {
        blogData[0].date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.post(`http://localhost:3005/createblog`, blogData[0]);
        navigate(`/blogs`);
        ToastrSuccess({ successMessage: "Blog Created!" });
      } catch (err) {
        ToastrError({ errorMessage: err.message });
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
    setBlogData((state) => {
      const newState = state[0];
      newState[name] = value;

      return [{ ...newState }];
    });
  };

  const checkImage = (val) => {
    if (!!id && typeof blogData[0].previousImage === "undefined") {
      console.log("coming");
      setBlogData((values) => {
        const newState = values[0];
        newState["previousImage"] = blogData[0].image;
        return [{ ...newState }];
      });
    }
    const reader = new FileReader();
    reader.readAsDataURL(val);
    console.log("image file", val);

    setBlogData((values) => {
      const newState = values[0];
      newState["image_name"] = val?.name;
      return [{ ...newState }];
    });

    reader.onload = () => {
      setPreviewImage(reader?.result);
      setBlogData((values) => {
        const newState = values[0];
        newState["image"] = reader?.result;
        return [{ ...newState }];
      });
    };
  };

  const publishBlog = () => {
    if (!!validated()) {
      postBlog();
    }
  };
  console.log("blog data", blogData);
  console.log("id ", id);
  return (
    <>
      <h1 className="createBlogTitle">Enter blog details</h1>

      <div className="create_blog_form">
        <input
          type="text"
          placeholder="Title"
          className="blog_input"
          value={blogData[0]?.title}
          onChange={(e) => {
            handleChangeBlog("title", e?.target?.value);
          }}
        />

        {error?.title && (
          <div className="invalidMessageBlog">{error?.title}</div>
        )}
        <textarea
          placeholder="Enter Description"
          rows={10}
          className="blog_textarea"
          value={blogData[0]?.description}
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
            name="myFile"
            title={blogData[0]?.image_name}
            onChange={(e) => {
              checkImage(e.target.files[0]);
            }}
          />
          <div className="imagePreview">
            <img src={imagePreview}></img>
          </div>
        </div>

        {error?.image && (
          <div className="invalidMessageBlog ">{error?.image}</div>
        )}

        <input
          type="text"
          placeholder="Author"
          value={blogData[0]?.author}
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
