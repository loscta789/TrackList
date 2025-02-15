"use client";

import { MdSettings, MdLink, MdExitToApp } from "react-icons/md";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { RiAdminLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

interface GroupSettingsProps {
  groupId: string;
  groupName: string;
  joinCode: string;
  currentUserRole: boolean;
  onClose: () => void;
  onCloseSettings: () => void;
  setIsOpenLink: (value: boolean) => void;
  onOpen: () => void;
}

export default function GroupSettings({ 
  groupId, 
  groupName, 
  joinCode, 
  onClose, 
  onCloseSettings, 
  currentUserRole, 
  setIsOpenLink,
  onOpen,
}: GroupSettingsProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full bg-background text-foreground flex flex-col p-6 border-t border-secondary z-50
                 max-h-[60vh] overflow-y-auto rounded-t-lg backdrop-blur-md"
    >
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MdSettings className="text-2xl text-primary" />
          <h2 className="font-bold text-lg">{groupName}</h2>
        </div>
        <button onClick={onCloseSettings} className="p-2 rounded-full hover:bg-secondary transition">
          <RxCross2 className="text-2xl text-primary" />
        </button>
      </div>

      {/* 🔹 Diviseur */}
      <div className="border-b border-secondary my-2"></div>

      {/* 🔹 Options */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => {
            setIsOpenLink(true);
            onCloseSettings();
          }}
          className="flex items-center px-4 py-3 bg-secondary/20 rounded-lg transition hover:bg-secondary/40"
        >
          <MdLink className="mr-3 text-xl text-accent" />
          <span className="font-medium">Generate the invitation link</span>
        </button>
      </div>

      {/* 🔹 Diviseur */}
      <div className="border-b border-secondary my-2"></div>

      {/* 🔹 View Members */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => router.push(`/group/${groupId}/manage`)}
          className="flex items-center px-4 py-3 bg-secondary/20 rounded-lg transition hover:bg-secondary/40"
        >
          <MdLink className="mr-3 text-xl text-accent" />
          <span className="font-medium">View group members</span>
        </button>
      </div>

      {/* 🔹 Diviseur */}
      <div className="border-b border-secondary my-2"></div>

      {/* 🔹 Leave Group */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={onOpen}
          className="flex items-center px-4 py-3 bg-error text-white rounded-lg transition hover:bg-error/80"
        >
          <MdExitToApp className="mr-3 text-xl" />
          <span className="font-medium">Leave Group</span>
        </button>
      </div>

      {/* 🔹 Diviseur */}
      <div className="border-b border-secondary my-2"></div>

      {/* 🔹 Manage Group (Admin Only) */}
      {currentUserRole && (
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => router.push(`/group/${groupId}/manage`)}
            className="flex items-center px-4 py-3 bg-secondary/20 rounded-lg transition hover:bg-secondary/40"
          >
            <RiAdminLine className="mr-3 text-xl text-error" />
            <span className="font-medium text-error">Manage Group</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
