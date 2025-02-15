"use client";

import { BsChatDotsFill } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";

interface ActionsButtonsProps {
  onOpenForm: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
  onCloseSettings: () => void;
  onToggleSettingsForm: () => void;
  onToggleShowForm: () => void;
  onToggleChat: () => void;
  onCloseChat: () => void;
}

export default function ActionsButtons({
  onOpenForm,
  onOpenSettings,
  onClose,
  onCloseSettings,
  onToggleSettingsForm,
  onToggleShowForm,
  onToggleChat,
  onCloseChat,
}: ActionsButtonsProps) {
  return (
    <div className="w-full h-full flex justify-between py-5 bg-background border-t border-secondary">
      {/* ✅ Chatbox */}
      <div className="flex flex-col items-center justify-center flex-1">
        <button
          onClick={() => {
            onToggleChat();
            onCloseSettings();
            onClose();
          }}
          className="flex items-center justify-center text-secondary hover:text-primary transition-all opacity-80 hover:opacity-100"
        >
          <BsChatDotsFill size={28} />
        </button>
        <span className="text-xs text-secondary">Chatbox</span>
      </div>

      {/* ✅ Plans (Ajout d'un élément) */}
      <div className="flex flex-col items-center justify-center flex-1">
        <button
          onClick={() => {
            onToggleShowForm();
            onCloseSettings();
            onCloseChat();
          }}
          className="flex items-center justify-center p-3 mb-1 rounded-full bg-success text-white hover:bg-success/80 transition-all shadow-lg"
        >
          <GoPlus size={22} />
        </button>
      </div>

      {/* ✅ More Options */}
      <div className="flex flex-col items-center justify-center flex-1">
        <button
          onClick={() => {
            onToggleSettingsForm();
            onClose();
            onCloseChat();
          }}
          className="flex items-center justify-center text-secondary hover:text-primary transition-all opacity-80 hover:opacity-100"
        >
          <HiDotsHorizontal size={22} />
        </button>
        <span className="text-xs text-secondary">More</span>
      </div>
    </div>
  );
}
