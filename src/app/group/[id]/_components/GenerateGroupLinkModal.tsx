"use client";

import { motion } from "framer-motion";
import { BsClipboard } from "react-icons/bs";

export default function GenerateGroupLinkModal({
  isOpen,
  onClose,
  joinCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  joinCode: string;
}) {
  if (!isOpen) return null;

  // 🔹 Fonction pour copier le lien dans le presse-papier
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      alert("Code copié dans le presse-papier !");
    } catch (err) {
      console.error("Erreur lors de la copie du code :", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-background p-6 rounded-lg shadow-lg w-80 border border-secondary"
      >
        {/* 🔗 Titre */}
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">🔗 Group Link</h2>
        
        {/* 🔹 Input avec icône copier */}
        <div className="relative">
          <input
            type="text"
            value={joinCode}
            readOnly
            className="w-full p-3 bg-secondary text-foreground text-center rounded-lg cursor-pointer select-all border border-secondary focus:ring-2 focus:ring-primary"
            onClick={(e) => e.currentTarget.select()} // Sélection automatique du texte au clic
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition"
          >
            <BsClipboard className="text-xl" />
          </button>
        </div>

        {/* 🔹 Bouton de fermeture */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={onClose}
            className="bg-error text-white px-4 py-2 rounded-lg shadow-md hover:bg-error/80 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
