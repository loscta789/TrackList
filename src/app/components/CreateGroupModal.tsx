import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addGroup } = useAuthStore();

  if (!isOpen) return null;

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/group/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupName, maxParticipants }),
      credentials: "include"
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      console.log("🎉 Groupe créé avec succès !", data);
      addGroup(data.group);
      alert("Groupe créé avec succès !");
      onClose();
    } else {
      setError(data.error || "Erreur inconnue");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background p-8 rounded-2xl shadow-xl w-full max-w-md border border-secondary/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-success/10">
                <Users className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Créer un groupe</h2>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-secondary/10 rounded-xl text-foreground border border-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Entrez le nom du groupe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Nombre de participants
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-secondary/10 rounded-xl text-foreground border border-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-sm bg-error/10 p-3 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl text-foreground hover:bg-secondary/20 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-success text-white rounded-xl hover:bg-success/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Création...
                    </>
                  ) : (
                    "Créer le groupe"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}