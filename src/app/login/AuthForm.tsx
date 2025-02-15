"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { loginUser, signUpGoogle, signUpFacebook } from "@/app/services/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/app/components/ui/card";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      await setUser(data);
      router.push("/");
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl bg-beige border border-gray-400 rounded-xl">
        {/* 🔹 Header */}
        <CardHeader>
          <CardTitle className="text-center text-gray-900 text-2xl font-bold">Welcome Back!</CardTitle>
          <p className="text-center text-gray-600">Log in to continue</p>
        </CardHeader>

        <CardContent>
          {/* 🔹 Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full bg-buttonBackgroundColor hover:bg-blue-600 transition text-white py-3 rounded-lg">
              Log In
            </Button>
          </form>

          {/* 🔹 Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="text-gray-500 px-4">OR</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          {/* 🔹 Social Login Buttons */}
          <div className="space-y-3">
            <Button
              onClick={signUpGoogle}
              variant="outline"
              className="w-full flex items-center justify-center py-3 border border-gray-500 bg-white text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              <FcGoogle className="text-2xl mr-2" />
              Continue with Google
            </Button>

            <Button
              onClick={signUpFacebook}
              variant="outline"
              className="w-full flex items-center justify-center py-3 border border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FaFacebook className="text-2xl mr-2" />
              Continue with Facebook
            </Button>
          </div>
        </CardContent>

        {/* 🔹 Footer */}
        <CardFooter className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-buttonBackgroundColor font-medium hover:underline cursor-pointer"
          >
            Register here
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
