"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, signUpGoogle, signUpFacebook } from "@/app/services/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/app/components/ui/card";

export default function AuthFormRegister() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    try {
      await registerUser(form.username, form.email, form.password);
      alert("🎉 Registration successful!");
      router.push("/login");
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4 py-8">
      <Card className="w-full max-w-sm phone:max-w-md shadow-lg bg-background border border-secondary rounded-xl p-4 phone:p-6">
        {/* 🔹 Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-xl phone:text-2xl font-bold">Create an Account</CardTitle>
          <p className="text-secondary text-sm phone:text-base">Join us to manage your shopping lists easily</p>
        </CardHeader>

        <CardContent>
          {/* 🔹 Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3 phone:space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-secondary text-foreground border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-secondary text-foreground border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-secondary text-foreground border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full bg-secondary text-foreground border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            {error && <p className="text-error text-sm text-center font-medium">{error}</p>}

            <Button type="submit" className="w-full bg-success hover:bg-green-600 text-white py-3 rounded-lg transition">
              Register
            </Button>
          </form>

          {/* 🔹 Divider */}
          <div className="flex items-center my-4 phone:my-6">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="text-gray-500 px-4 text-sm phone:text-base">OR</span>
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
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Login here
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
