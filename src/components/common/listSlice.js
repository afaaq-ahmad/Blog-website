import { createSlice } from "@reduxjs/toolkit";

export const listSlice = createSlice({
  name: "lists",
  initialState: { blogs: [], articles: [], isDark: false, imageTitle: "" },
  reducers: {
    getBlogList: (state, action) => {
      state.blogs = action?.payload;
    },
    getArticleList: (state, action) => {
      state.articles = action?.payload;
    },
    changeTheme: (state) => {
      if (!!state?.isDark) {
        state.isDark = false;
      } else {
        state.isDark = true;
      }
    },
    deleteBlogFromStore: (state, action) => {
      state?.blogs?.splice(
        state?.blogs?.findIndex((blog) => blog.id === action?.payload),
        1
      );
    },
    deleteArticleFromStore: (state, action) => {
      state?.articles?.splice(
        state?.articles?.findIndex((article) => article.id === action?.payload),
        1
      );
    },
  },
});

export const {
  getBlogList,
  getArticleList,
  deleteBlogFromStore,
  deleteArticleFromStore,
  changeTheme,
} = listSlice?.actions;

export const selectBlogList = (state) => {
  return state?.lists?.blogs;
};

export const selectArticleList = (state) => {
  return state?.lists?.articles;
};

export const selectChangeTheme = (state) => {
  return state?.lists?.isDark;
};

export default listSlice?.reducer;
