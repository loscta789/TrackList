"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { MdSettings, MdExitToApp } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface GroupSettingsProps {
  onClose: () => void;
}

export default function GroupSettings({ onClose }: GroupSettingsProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-background p-6 rounded-lg shadow-lg w-80 border border-secondary"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
            <MdSettings className="text-xl text-accent" />
            Group Settings
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition">
            <RxCross2 className="text-2xl text-foreground" />
          </button>
        </div>

        <p className="text-secondary mb-4">Modify group settings and manage members.</p>

        <Button variant="destructive" className="w-full flex items-center gap-2 bg-error text-white hover:bg-error/80">
          <MdExitToApp />
          Leave Group
        </Button>
      </motion.div>
    </div>
  );
}
