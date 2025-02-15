"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { fetchGroupDetails } from "@/app/services/groups";
import GroupHeader from "./GroupHeader";
import GroupMember from "./GroupMember";
import GroupSettings from "./GroupSettings";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { MdPeople } from "react-icons/md";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export default function ManageGroup() {
  const user = useAuthStore((state) => state.user);
  const currentGroup = useAuthStore((state) => state.currentGroup);
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (currentGroup?.id) {
      fetchGroupDetails(currentGroup.id).then((data) => {
        if (data) setGroupDetails(data);
      });
    }
  }, [currentGroup]);

  if (!user) return <p className="text-error text-center">Vous devez être connecté pour voir cette page.</p>;
  if (!currentGroup) return <p className="text-warning text-center">Aucun groupe sélectionné.</p>;
  if (!groupDetails) return <p className="text-secondary text-center">Chargement des détails du groupe...</p>;

  // ✅ Vérifier si l'utilisateur actuel est admin
  const isAdmin = groupDetails.members.some((member) => member.id === user.id && member.isAdmin);

  // ✅ Formatage de la date
  const formattedDate = format(new Date(groupDetails.created_at), "d MMMM yyyy", { locale: enUS });

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* 🔹 Header du groupe */}
      <GroupHeader
        name={groupDetails.name}
        joinCode={groupDetails.joinCode}
        isAdmin={isAdmin}
        createdAt={formattedDate} // ✅ Passe la date formatée
        max_participants={groupDetails.max_participants}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* 🔹 Liste des membres */}
      <Card className="shadow-lg bg-secondary/20 border border-secondary">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <MdPeople className="text-accent" /> Group Members
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[300px] overflow-y-auto space-y-3">
            {groupDetails.members.map((member) => (
              <GroupMember key={member.id} member={member} />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 🔹 Group Settings Modal */}
      {showSettings && <GroupSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
