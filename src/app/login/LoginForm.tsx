"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { loginUser, signUpGoogle, signUpFacebook } from "@/app/services/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/app/components/ui/card";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(form.email, form.password);
      if (user) {
        console.log("✅ Utilisateur connecté :", user);
        useAuthStore.getState().setUser(user);
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-sm phone:max-w-md tablet:max-w-lg shadow-xl bg-secondary border border-gray-300 rounded-xl p-6">
        {/* 🔹 Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Welcome Back!</CardTitle>
          <p className="text-secondaryTextColor">Log in to continue</p>
        </CardHeader>

        <CardContent>
          {/* 🔹 Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            {error && <p className="text-error text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/80 transition py-3 rounded-lg">
              Log In
            </Button>
          </form>

          {/* 🔹 Social Login */}
          <div className="flex flex-col gap-3 mt-6">
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
        <CardFooter className="text-center text-secondaryTextColor text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Register here
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
