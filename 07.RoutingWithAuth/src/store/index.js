import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import React from "react";
import axios from "axios";

export const store = configureStore({
  reducer: combineReducers({
    auth: authSlice.reducer,
  }),
});

axios.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (config.url.indexOf("login") === -1 && config.url.indexOf("register") === -1 && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
