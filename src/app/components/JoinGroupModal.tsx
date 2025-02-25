import React, { useState } from "react";
import { joinGroup } from "../services/groups";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus } from "lucide-react";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour rejoindre un groupe.");
      setLoading(false);
      return;
    }

    const result = await joinGroup(joinCode);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Vous avez rejoint le groupe avec succès !");
      setJoinCode("");
      await checkAuth();
      setTimeout(onClose, 2000);
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
              <div className="p-3 rounded-full bg-primary/10">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Rejoindre un groupe</h2>
            </div>

            <form onSubmit={handleJoinGroup} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Code d'invitation
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-secondary/10 rounded-xl text-foreground border border-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 uppercase"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Entrez le code du groupe"
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

              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-success text-sm bg-success/10 p-3 rounded-lg"
                >
                  {success}
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
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Connexion...
                    </>
                  ) : (
                    "Rejoindre le groupe"
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