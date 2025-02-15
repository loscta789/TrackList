"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/auth";
import { useAuthStore } from "../store/authStore";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function FormLogin() {
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
    <div className="flex items-center justify-center   p-6">
      <Card className="w-full max-w-md shadow-lg bg-opacity-20 backdrop-blur-lg border border-gray-700 rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-primaryTextColor text-2xl font-bold">Log in to your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Log In Button */}
            <Button type="submit" className="w-full bg-buttonBackgroundColor hover:bg-blue-600 transition text-white py-3 rounded-lg">
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="text-gray-400 px-4">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Register Button */}
          <Button variant="outline" className="w-full bg-blue-500 text-white" onClick={() => router.push("/register")}>
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
