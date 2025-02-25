"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { fetchGroupDetails } from "@/app/services/groups";
import GroupHeader from "./_components/GroupHeader";
import GroupMember from "./_components/GroupMember";
import GroupSettings from "./_components/GroupSettings";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { MdPeople } from "react-icons/md";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface GroupMemberType {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface GroupDetailsType {
  id: string;
  name: string;
  joinCode: string;
  created_at: string;
  max_participants: number;
  members: GroupMemberType[];
}

export default function ManageGroup() {
  const user = useAuthStore((state) => state.user);
  const currentGroup = useAuthStore((state) => state.currentGroup);
  const [groupDetails, setGroupDetails] = useState<GroupDetailsType | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (currentGroup?.id) {
      fetchGroupDetails(currentGroup.id).then((data: GroupDetailsType) => {
        if (data) setGroupDetails(data);
      });
    }
  }, [currentGroup]);

  if (!user) return <p className="text-error text-center">Vous devez être connecté pour voir cette page.</p>;
  if (!currentGroup) return <p className="text-warning text-center">Aucun groupe sélectionné.</p>;
  if (!groupDetails) return <p className="text-secondary text-center">Chargement des détails du groupe...</p>;

  // ✅ Vérifier si l'utilisateur actuel est admin avec un typage correct
  const isAdmin = groupDetails.members.some((member: GroupMemberType) => member.id === user.id && member.isAdmin);

  // ✅ Formatage de la date
  const formattedDate = format(new Date(groupDetails.created_at), "d MMMM yyyy", { locale: enUS });

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* 🔹 Header du groupe */}
      <GroupHeader
        name={groupDetails.name}
        joinCode={groupDetails.joinCode}
        isAdmin={isAdmin}
        createdAt={formattedDate}
        max_participants={groupDetails.max_participants}
        onUpdateGroupName={function (newName: string): void {
          throw new Error("Function not implemented.");
        } }      />

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
            {groupDetails.members.map((member: GroupMemberType) => (
              <GroupMember 
              key={member.id} 
              member={member}
              isAdmin={isAdmin}
              onRemoveMember={() => {}}
              onToggleAdmin={() => {}}
               />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 🔹 Group Settings Modal */}
      {showSettings && <GroupSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
