"use client";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";


export default function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background text-foreground px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-3xl phone:text-4xl font-bold tracking-wide text-primary">
          Welcome to Grocery Groups
        </h1>
        <p className="text-secondary text-lg mt-2">
          Organize your shopping lists effortlessly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-sm phone:max-w-md tablet:max-w-lg mt-6 bg-background tablet:mt-12 bg-secondary p-6 rounded-lg shadow-lg"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}
