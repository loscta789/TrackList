"use client";
import { useState } from "react";
import { joinGroup } from "../services/groups"; // ✅ Import direct de la fonction joinGroup
import { useAuthStore } from "../store/authStore"; // ✅ Pour rafraîchir la liste des groupes après ajout

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
  const { user, checkAuth } = useAuthStore(); // ✅ Récupérer l'utilisateur et recharger les groupes après ajout

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

    if (!user) {
      setError("Vous devez être connecté pour rejoindre un groupe.");
      setLoading(false);
      return;
    }

    const result = await joinGroup(joinCode, user.id); // ✅ Appel direct de la fonction `joinGroup()`
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Vous avez rejoint le groupe avec succès !");
      setJoinCode("");
      await checkAuth(); // ✅ Rafraîchir la liste des groupes de l'utilisateur
      setTimeout(onClose, 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-96 border border-secondary">
        <h2 className="text-2xl font-bold mb-4 text-primary">Rejoindre un groupe</h2>
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div>
            <label className="block text-foreground">Code d'invitation</label>
            <input
              type="text"
              className="w-full p-2 bg-secondary rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Entrez le code du groupe"
              required
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}
          {success && <p className="text-success text-sm">{success}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-error text-white px-4 py-2 rounded-lg hover:bg-error/80 transition-all"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/80 transition-all"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Rejoindre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
