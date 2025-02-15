"use client";

import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import  RegisterModal  from "./RegisterModal";
import LoginModal from "./LoginModal";
import { useAuthStore } from "../store/authStore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import {signUpGoogle, signUpFacebook} from "@/app/services/auth";

export default function HeaderRegister() {

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  console.log("user:, " , user)


  return  (
    <div className="h-[40vh] flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <section className="bg-black p-6 rounded-lg shadow-lg w-96">
        {/* LOGO */}
        <div className="text-white flex flex-col items-center space-y-2">
          <p className="text-3xl font-bold">LOGO</p>
          <span className="text-gray-400">LOG IN TO CONTINUE</span>
        </div>

        {/* BOUTONS DE CONNEXION */}
        <div className="mt-6 space-y-4">
          <button onClick={signUpGoogle} className="flex items-center justify-center w-full py-3 border border-white text-white rounded-lg hover:bg-gray-800 transition">
            <FcGoogle className="text-2xl mr-2"  />
            CONTINUE WITH GOOGLE
          </button>

          <button onClick={signUpFacebook} className="flex items-center justify-center w-full py-3 border border-white text-white rounded-lg hover:bg-gray-800 transition">
            <FaFacebook className="text-2xl text-blue-500 mr-2" />
            CONTINUE WITH FACEBOOK
          </button>

        </div>
      </section>
    </div>
  );
}
