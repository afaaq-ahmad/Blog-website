import "./createblogstyle.css";
import "./SignupStyle.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";

const CreateBlog = () => {
  const { id } = useParams();
  const [error, setError] = useState({});
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
    setTimeout(() => toastr.success(`Blogs list updated`, `Success!`), 300);
  };

  const blogNotify = () => {
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
    setTimeout(() => toastr.success(`Blog updated`, `Success!`), 300);
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
    } catch {
      console.log("get");
      errorNotify();
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
        blogNotify();
        navigate(`/blog/${id}`);
      } catch {
        errorNotify();
      }
    } else {
      try {
        blogData.date =
          dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        await axios.post(`http://localhost:3001/blogs/`, blogData);
        notify();
        navigate(`/blogs`);
      } catch {
        errorNotify();
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

    console.log(checkError);
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
