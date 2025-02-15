"use client";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

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

  if (!isOpen) return null; // Empêche l'affichage si fermé

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupName, maxParticipants }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      console.log("🎉 Groupe créé avec succès !", data);
      addGroup(data.group); // Ajoute le groupe à la liste
      alert("Groupe créé avec succès !");
      onClose(); // Ferme la modale
    } else {
      setError(data.error || "Erreur inconnue");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-96 border border-secondary">
        <h2 className="text-2xl font-bold mb-4 text-primary">Créer un groupe</h2>
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-foreground">Nom du groupe</label>
            <input
              type="text"
              className="w-full p-2 bg-secondary rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-foreground">Nombre de participants</label>
            <input
              type="number"
              className="w-full p-2 bg-secondary rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              min="1"
              required
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

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
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
