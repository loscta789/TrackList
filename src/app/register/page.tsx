"use client";
import { motion } from "framer-motion";
import AuthFormRegister from "./AuthFormRegister";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl mb-8"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4">
          Join Grocery Groups
        </h1>
        <p className="text-secondary text-lg sm:text-xl">
          Create an account and start organizing your shopping lists today
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <AuthFormRegister />
      </motion.div>
    </div>
  );
}