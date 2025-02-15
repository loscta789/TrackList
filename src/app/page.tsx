"use client";
import { useState, useEffect } from "react";
import { getUser, logoutUser } from "./services/auth";
import { useRouter } from "next/navigation";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import CreateGroupModal from "./components/CreateGroupModal";
import JoinGroupModal from "./components/JoinGroupModal";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";

export default function Page() {
  const [user, setUser] = useState(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gradient-to-br from-background to-secondary text-foreground px-6 py-8">
      {/* 🔹 Title */}
      <h1 className="text-2xl phone:text-3xl tablet:text-4xl font-extrabold text-center tracking-wide text-primary max-w-3xl">
        Create shared lists, track purchases, and simplify your group shopping experience!
      </h1>

      {/* 📌 Cards Container */}
      <div className="grid grid-cols-1 phone:grid-cols-2 gap-4 phone:gap-6 tablet:gap-12 w-full max-w-4xl mt-8">
        {/* 🟢 Create Group Card */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="w-full h-full flex flex-col bg-background shadow-soft border border-secondary rounded-xl p-6 cursor-pointer transition-all hover:shadow-strong"
            onClick={() => setIsGroupModalOpen(true)}
          >
            <CardHeader className="flex flex-col items-center">
              <FaUsers className="text-6xl text-success mb-4" />
              <h2 className="text-xl tablet:text-2xl font-semibold text-center text-foreground">
                Create a Group
              </h2>
            </CardHeader>
            {/* 🔹 Content takes full height */}
            <CardContent className="text-secondary text-center flex-grow flex items-center justify-center">
              Start your own group and invite friends to join you!
            </CardContent>
            {/* 🔹 Footer stays at the bottom */}
            <CardFooter className="mt-auto">
              <Button className="w-full bg-success hover:bg-success/80 text-white py-2 px-4 rounded-lg transition-all">
                Create
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* 🔵 Join Group Card */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="w-full h-full flex flex-col bg-background shadow-soft border border-secondary rounded-xl p-6 cursor-pointer transition-all hover:shadow-strong"
            onClick={() => setIsJoinGroupModalOpen(true)}
          >
            <CardHeader className="flex flex-col items-center">
              <FaUserPlus className="text-6xl text-accent mb-4" />
              <h2 className="text-xl tablet:text-2xl font-semibold text-center text-foreground">
                Join a Group
              </h2>
            </CardHeader>
            {/* 🔹 Content takes full height */}
            <CardContent className="text-secondary text-center flex-grow flex items-center justify-center">
              Find a group and join an active community.
            </CardContent>
            {/* 🔹 Footer stays at the bottom */}
            <CardFooter className="mt-auto">
              <Button className="w-full bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-lg transition-all">
                Join
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* 📌 Modals */}
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
      <JoinGroupModal isOpen={isJoinGroupModalOpen} onClose={() => setIsJoinGroupModalOpen(false)} />
    </div>
  );
}
