"use client";

import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionMenu({ onEdit, onDelete }: ActionMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ✅ Overlay pour fermer le menu en cliquant en dehors */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      <div className="relative z-50">
        {/* 🔹 Bouton du menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-secondary hover:text-primary transition-all"
        >
          <FiMoreVertical size={20} />
        </button>

        {/* 🔹 Menu déroulant */}
        {menuOpen && (
          <div className="absolute right-0 bg-background border border-secondary text-foreground p-3 rounded-lg shadow-xl w-40 flex flex-col transition-all duration-200">
            <button
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 hover:bg-secondary p-2 rounded-lg transition-all"
            >
              <MdEdit size={18} className="text-primary" />
              Modifier
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 hover:bg-error hover:text-white p-2 rounded-lg transition-all text-error"
            >
              <MdDelete size={18} />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </>
  );
}
