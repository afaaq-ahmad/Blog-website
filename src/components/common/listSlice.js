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
  },
});

export const { getBlogList, getArticleList } = listSlice?.actions;

export const selectBlogList = (state) => {
  return state?.lists?.blogs;
};

export const selectArticleList = (state) => {
  return state?.lists?.articles;
};

export default listSlice?.reducer;
