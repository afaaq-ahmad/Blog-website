import { useNavigate } from "react-router-dom";
import Loader from "../components/loader/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
import "toastr/build/toastr.min.css";
import styles from "./home.module.css";
import ToastrError from "../components/common/ToastrError";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlogList,
  selectBlogList,
  deleteBlogFromStore,
} from "../components/common/listSlice";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Checkbox from "@mui/material/Checkbox";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogList);
  const user_ID = localStorage.getItem("user-id");
  const [checkedBlogs, setCheckedBlogs] = useState([]);
  const checkBoxes = document.getElementsByName("chkbox");
  const [usersAllBlogs, setUsersAllBlogs] = useState([]);
  const [checkboxAll, setCheckboxAll] = useState(false);
  const theme = createTheme({
    palette: {
      greenishBlue: {
        main: "#55bebb",
      },
    },
  });

  const getBlogObj = async () => {
    try {
      const getBlogs = await axios?.get(`http://localhost:3005/blogs/`);
      dispatch(getBlogList(getBlogs?.data));
    } catch (err) {
      ToastrError({ errorMessage: err.message });
    }
  };

  const getUsersAllBlogs = () => {
    const arr = [];
    blogs?.map((blog) => {
      if (user_ID === blog?.userID) {
        arr.push(blog?.id);
      }
    });
    setUsersAllBlogs(arr);
  };

  useEffect(() => {
    setIsLoading(false);
    getBlogObj();
    setTimeout(() => {
      setIsLoading(true);
    }, 500);
  }, []);

  useEffect(() => {
    getUsersAllBlogs();
  }, [blogs]);

  const handleCheckboxes = (event, value) => {
    event.stopPropagation();
    const arr = [...checkedBlogs];
    if (!!checkedBlogs?.includes(value)) {
      let index = checkedBlogs?.indexOf(value);
      arr?.splice(index, 1);
      setCheckboxAll(false);
    } else {
      arr?.push(value);

      if (usersAllBlogs?.length === arr?.length) {
        setCheckboxAll(true);
      }
    }

    setCheckedBlogs(arr);
  };

  const deleteBlogs = () => {
    checkBoxes[checkBoxes?.length - 1].checked = false;
    const delABlog = async (index) => {
      try {
        const del = await axios.delete(`http://localhost:3001/blogs/${index}`);
        if (del.status === 200) {
          dispatch(deleteBlogFromStore(index));
        }
      } catch (err) {
        ToastrError({ errorMessage: err?.message });
      }
    };
    checkedBlogs?.map((blogId) => {
      delABlog(blogId);
    });
    setCheckedBlogs([]);
  };

  const selectAll = () => {
    if (!checkboxAll) {
      setCheckboxAll(true);
      for (let i = 0; i < checkBoxes?.length; i++) {
        checkBoxes[i].checked = true;
      }
      const arr = [];
      setCheckedBlogs([]);
      blogs?.map((blog) => {
        if (user_ID === blog?.userID) {
          arr.push(blog?.id);
        }
      });
      setCheckedBlogs(arr);
    } else {
      setCheckboxAll(false);
      for (let i = 0; i < checkBoxes?.length; i++) {
        checkBoxes[i].checked = false;
      }
      setCheckedBlogs([]);
    }
  };
  return (
    <>
      {!isLoading ? (
        <Loader />
      ) : (
        <div className={styles?.flexContainer}>
          <div className={styles?.createBlogDiv}>
            <div className={styles?.iconContainer}>
              {checkedBlogs?.length > 0 && (
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  style={{ fontSize: "12px", margin: "2px 7px" }}
                  onClick={() => deleteBlogs()}
                >
                  Delete
                </Button>
              )}
              {checkedBlogs?.length === 1 && (
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
                    localStorage.setItem("from blogs", true);
                    navigate(`/create-blog/${checkedBlogs[0]}`);
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
            {usersAllBlogs?.length > 0 && (
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
                className={styles.createBlogText}
                onClick={() => {
                  navigate(`/create-blog`);
                }}
              />
            </div>
          </div>

          {blogs?.length > 0 &&
            blogs?.map((blog, i) => (
              <div key={i} className={styles?.blogContainer}>
                <div
                  className={styles?.eachBlog}
                  onClick={() => {
                    localStorage.removeItem("from blogs");
                    navigate(`/blog/${blog?.id}`);
                  }}
                >
                  <div className={styles?.imageContainer}>
                    <img src={blog.image} alt="Blog"></img>
                    {blog?.userID === user_ID && (
                      <input
                        type="checkbox"
                        name="chkbox"
                        className={styles?.checkStyle}
                        onClick={(e) => handleCheckboxes(e, blog?.id)}
                      />
                    )}
                  </div>
                  <div className={styles?.blogTitleContainer}>
                    <div className={styles?.blogTitle}>
                      {blog.title.length < 40
                        ? blog.title
                        : blog.title.slice(0, 35) + "..."}
                    </div>
                    <div className={styles?.dateStyle}>{blog?.date}</div>
                    <div className={styles.descStyle}>
                      {blog?.description?.length < 400
                        ? blog?.description
                        : blog?.description.slice(0, 400) + "..."}
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

export default Home;
