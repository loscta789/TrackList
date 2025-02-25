"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getGroupDetails } from "@/app/services/groups";
import ContributionList from "./_components/ContributionList";
import { useAuthStore } from "@/app/store/authStore"; // ✅ Import du store Zustand
import { Loader } from "@/app/components/Loader"; // ✅ Import du Loader
import { Button } from "@/app/components/ui/button";
import {GroupInfo} from "@/app/group/[id]/_typings/groupInterfaces"
import Link from "next/link";

export default function GroupPage() {
  const { id } = useParams() as { id: string };
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const {isAuthenticated} = useAuthStore(); // ✅ Récupération de l'état d'authentification
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // ✅ Stockage de l'ID de l'utilisateur actuel

  const fetchGroup = useCallback(async () => {
    setLoading(true);
    const data = await getGroupDetails(id);
    console.log("data groups", data)
    setGroup(data?.response.data.group);
    setCurrentUserId(data?.response.data.currentUserId); // ✅ Mise à jour de l'ID de l'utilisateur actuel
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  // 🔥 Fonction pour mettre à jour l'affichage après ajout d'un élément

  return (
    <div className="relative flex items-center justify-center h-screen bg-background overflow-hidden text-foreground">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader />
          <p className="text-lg font-medium text-secondary">Chargement du groupe...</p>
        </div>
      ) : !isAuthenticated ? (
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
        <div className="w-full h-screen overflow-hidden ">
          <ContributionList 
            group={group}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
}
