"use client";
import { motion } from "framer-motion";
import AuthFormRegister from "./AuthFormRegister";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-6 py-12">
      {/* 🔹 Animation sur l'en-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-2xl phone:text-3xl tablet:text-4xl font-bold text-primary tracking-wide">
          Welcome to Grocery Groups
        </h1>
        <p className="text-secondary text-base phone:text-lg mt-2">
          Organize your shopping lists effortlessly.
        </p>
      </motion.div>

      {/* 🔹 Animation sur le formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-sm phone:max-w-md mt-6 bg-secondary p-6 rounded-lg shadow-lg"
      >
        <AuthFormRegister />
      </motion.div>
    </div>
  );
}
