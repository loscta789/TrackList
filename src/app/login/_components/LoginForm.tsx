"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { loginUser, signUpGoogle, signUpFacebook } from "@/app/services/auth";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/app/components/ui/card";
import { LoginFormData } from '@/app/login/_typings/form';
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await loginUser(form.email, form.password);
      if (!user.success) {
        setError(user.error);
        return;
      }

      useAuthStore.getState().setUser(user);
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-sm border border-secondary/20 rounded-2xl shadow-xl overflow-hidden">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-primary">Welcome Back!</CardTitle>
        <p className="text-secondary">Sign in to continue to your account</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="pl-10 py-5 bg-secondary/10 border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="pl-10 py-5 bg-secondary/10 border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm bg-error/10 p-3 rounded-lg text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-xl font-medium transition-all"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-secondary">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={signUpGoogle}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-xl py-5 transition-all"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Google
          </Button>

          <Button
            onClick={signUpFacebook}
            variant="outline"
            className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none rounded-xl py-5 transition-all"
          >
            <FaFacebook className="w-5 h-5 mr-2" />
            Facebook
          </Button>
        </div>
      </CardContent>

      <CardFooter className="text-center pb-8">
        <p className="text-secondary">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-primary font-medium hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}