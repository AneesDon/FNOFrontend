"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useReducer } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({});

const initialState = {
  data: [],
  isLoggedIn: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload.data,
        isLoggedIn: action.payload.isLoggedIn,
      };
    // case "CHECK_IS_LOGGEDIN":
    //   return {
    //     ...state,
    //     isLoggedIn: action.payload,
    //   };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const { data, isLoggedIn } = state;

  // ---------LOGIN API CALL---------
  const getData = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post(`${API_ROUTER.LOGIN}`, {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        dispatch({
          type: "SET_DATA",
          payload: { data: response.data, isLoggedIn: true },
        });
        Cookies.set("access", response.data?.tokens?.access);
        Cookies.set("refresh", response.data?.tokens?.refresh);

        router.push("/activeoi");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error while login", error);
    }
  };



  // -------GET NEW REFRESH TOKEN AND STORING IN COKIES AFTER EVERY 55 MINS from handleSubmit function------------
  const refreshToken = async () => {
    try {
      const getAccessCookie = Cookies.get("access");
      const getRefreshCookie = Cookies.get("refresh");
      const newRefreshToken = await axiosInstance.post(
        `${API_ROUTER.REFRESH_TOKEN}`,
        { refresh: getRefreshCookie },
        { headers: { Authorization: `Bearer ${getAccessCookie}` } }
      );
      Cookies.set("access", newRefreshToken.data.access);
      // console.log("new token is============================,",newRefreshToken);
      // console.log("new token is==============,",newRefreshToken.access);
    } catch (error) {
      console.log("error getting refresh token", error);
    }
  };


  const setLoginStatus = ()=>{
    dispatch({
      type: "SET_DATA",
      payload: { isLoggedIn: false },
    });
  }

  return (
    <AuthContext.Provider
      value={{ ...state, data, getData, refreshToken, isLoggedIn,setLoginStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
