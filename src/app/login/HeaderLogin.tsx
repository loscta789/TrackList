"use client";

import React from "react";
import { useAuthStore } from "../store/authStore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { signUpGoogle, signUpFacebook } from "@/app/services/auth";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function HeaderLogin() {
  const user = useAuthStore((state) => state.user);
  console.log("user: ", user);

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="bg-opacity-10 backdrop-blur-lg border border-gray-700 bg-beige shadow-xl w-full max-w-sm sm:max-w-md p-6 rounded-xl">
        {/* 🔹 LOGO & HEADER */}
        <CardHeader className="text-center">
          <p className="text-4xl font-extrabold text-black tracking-wide">LOGO</p>
          <span className="text-gray-400 text-lg font-medium">Log in to continue</span>
        </CardHeader>

        {/* 🔹 LOGIN BUTTONS */}
        <CardContent className="mt-4 space-y-4">
          <Button
            onClick={signUpGoogle}
            variant="outline"
            className="w-full flex items-center justify-center py-3 border border-white bg-gray-300 text-primaryTextColor rounded-lg hover:bg-gray-800 hover:scale-[1.05] transition-all"
          >
            <FcGoogle className="text-2xl mr-2 " />
            Continue with Google
          </Button>

          <Button
            onClick={signUpFacebook}
            variant="outline"
            className="w-full flex items-center justify-center py-3 border bg-blue-500 border-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-[1.05] transition-all"
          >
            <FaFacebook className="text-2xl text-white mr-2" />
            Continue with Facebook
          </Button>
        </CardContent>

        {/* 🔹 FOOTER (Optional) */}
        <CardFooter className="text-center text-gray-500 text-sm mt-4">
          Secure login with Google & Facebook
        </CardFooter>
      </Card>
    </div>
  );
}
