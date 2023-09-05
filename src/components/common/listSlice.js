import { createSlice } from "@reduxjs/toolkit";

export const listSlice = createSlice({
  name: "lists",
  initialState: { blogs: [], articles: [] },
  reducers: {
    getBlogList: (state, action) => {
      state.blogs = action?.payload;
    },
    getArticleList: (state, action) => {
      state.articles = action?.payload;
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
} = listSlice?.actions;

export const selectBlogList = (state) => {
  return state?.lists?.blogs;
};

export const selectArticleList = (state) => {
  return state?.lists?.articles;
};

export default listSlice?.reducer;
