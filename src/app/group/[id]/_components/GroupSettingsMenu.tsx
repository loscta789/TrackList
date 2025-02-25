"use client";

import { MdSettings } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";
import { motion } from "framer-motion";

interface GroupSettingsMenuProps {
  groupName: string;
  onClose: () => void;
  onOpenLinkModal: () => void;
}

export default function GroupSettingsMenu({ groupName, onClose, onOpenLinkModal }: GroupSettingsMenuProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 z-50 bg-secondaryThemeColor text-primaryTextColor flex flex-col p-6 shadow-md"
    >
      {/* Titre avec icône */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        <MdSettings className="inline-block text-2xl mr-2" />
        {groupName}
      </h2>

      {/* Options du menu */}
      <div className="space-y-4">
        <button
          onClick={onOpenLinkModal}
          className="flex items-center w-full text-left p-4 rounded-lg border border-primaryTextColor hover:bg-gray-800 transition-all"
        >
          <BsLink45Deg className="mr-3 text-xl" />
          Générer un lien d’invitation
        </button>

        <button className="flex items-center w-full text-left p-4 rounded-lg border border-primaryTextColor hover:bg-gray-800 transition-all">
          <MdSettings className="mr-3 text-xl" />
          Modifier le groupe
        </button>

        <button className="flex items-center w-full text-left p-4 rounded-lg border border-red-600 hover:bg-red-600 transition-all">
          <IoExitOutline className="mr-3 text-xl" />
          Quitter le groupe
        </button>
      </div>

      {/* Bouton de fermeture */}
      <div className="flex justify-center mt-auto">
        <button onClick={onClose} className="bg-red-500 px-4 py-2 rounded text-white">
          Exit
        </button>
      </div>
    </motion.div>
  );
}
