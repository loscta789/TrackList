"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getGroupDetails } from "@/app/services/groups";
import ContributionList from "./ContributionList";
import { useAuthStore } from "@/app/store/authStore"; // ✅ Import du store Zustand
import { Loader } from "@/app/components/Loader"; // ✅ Import du Loader
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user); // ✅ Récupérer l'utilisateur connecté

  const fetchGroup = useCallback(async () => {
    setLoading(true);
    const data = await getGroupDetails(id);
    console.log("data", data);
    
    setGroup(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  // 🔥 Fonction pour mettre à jour l'affichage après ajout d'un élément
  const updateGroup = (userId: string, newItem: { id: string; content: string }) => {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.map((member) =>
        member.id === userId ? { ...member, items: [...member.items, newItem] } : member
      ),
    }));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader />
          <p className="text-lg font-medium text-secondary">Chargement du groupe...</p>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-xl font-semibold text-error">⚠️ Vous devez être connecté pour voir cette page.</p>
          <Link href="/login">
            <Button className="bg-primary text-white hover:bg-primary/80">Se connecter</Button>
          </Link>
        </div>
      ) : !group ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-xl font-semibold text-warning">⚠️ Groupe introuvable.</p>
          <Link href="/groups">
            <Button className="bg-primary text-white hover:bg-primary/80">Retour aux groupes</Button>
          </Link>
        </div>
      ) : (
        <div className="w-full  min-h-screen ">
          <ContributionList 
            members={group.members} 
            groupId={id} 
            updateGroup={updateGroup} 
            currentUserId={user.id} 
            groupName={group.name} 
            joinCode={group.joinCode} 
          />
        </div>
      )}
    </div>
  );
}
