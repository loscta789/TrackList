"use client";

import { MdSettings, MdLink, MdExitToApp } from "react-icons/md";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { RxCross2 } from "react-icons/rx";

interface ManageSettingsProps {
  groupId: string;
  groupName: string;
  joinCode: string;
  currentUserRole: boolean;
  onClose: () => void;
  onCloseSettings: () => void;
  setIsOpenLink: (value: boolean) => void;
}

export default function GroupSettings({ 
  groupId, 
  groupName, 
  joinCode, 
  onClose, 
  onCloseSettings, 
  currentUserRole, 
  setIsOpenLink 
}: ManageSettingsProps) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full bg-white text-primaryTextColor flex flex-col p-6 border-t border-b z-50
                 max-h-[60vh] overflow-y-auto rounded-t-lg backdrop-blur-md"
    >
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MdSettings className="text-2xl text-gray-700" />
          <h2 className="font-bold text-lg">{groupName}</h2>
        </div>
        <button onClick={onCloseSettings} className="p-2 rounded-full hover:bg-gray-200 transition">
          <RxCross2 className="text-2xl text-gray-700" />
        </button>
      </div>

      {/* 🔹 Diviseur */}
      <div className="border-b border-gray-200 my-2"></div>

      {/* 🔹 Options */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => {
            setIsOpenLink(true);
            onCloseSettings();
          }}
          className="flex items-center px-4 py-3 bg-gray-100 rounded-lg transition hover:bg-gray-200"
        >
          <MdLink className="mr-3 text-xl text-blue-500" />
          <span className="text-gray-700 font-medium">Generate the invitation link</span>
        </button>
      </div>



      

      {/* 🔹 Quitter le groupe */}
      {!currentUserRole && (
        <button className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
          <MdExitToApp className="mr-2 text-xl" />
          <span className="font-medium">Leave Group</span>
        </button>
      )}
    </motion.div>
  );
}
