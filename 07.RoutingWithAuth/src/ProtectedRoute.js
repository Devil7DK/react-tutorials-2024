import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { authSlice } from "./store/auth";

export const ProtectedRoute = () => {
  const dispatch = useDispatch();

  const { accessToken, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user")
      .then((response) => {
        const user = response.data;

        dispatch(authSlice.actions.setUser(user));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          dispatch(authSlice.actions.setLoading(false));
        }, 1000);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
