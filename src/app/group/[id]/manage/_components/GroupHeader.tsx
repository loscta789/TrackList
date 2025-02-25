"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { MdPeople, MdCalendarToday, MdVpnKey, MdRefresh, MdEdit, MdCheck } from "react-icons/md";

interface GroupHeaderProps {
  name: string;
  joinCode: string;
  isAdmin: boolean;
  createdAt: string;
  max_participants: number;
  onUpdateGroupName: (newName: string) => void;
}

export default function GroupHeader({ 
  name, 
  joinCode, 
  isAdmin, 
  createdAt, 
  max_participants,
  onUpdateGroupName
}: GroupHeaderProps) {
  const [groupName, setGroupName] = useState(name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [maxPart, setMaxPart] = useState(max_participants);
  const [isEditingMax, setIsEditingMax] = useState(false);
  const [currentJoinCode, setCurrentJoinCode] = useState(joinCode);

  // ✅ Génération d'un nouveau code d'invitation
  const handleRegenerateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCurrentJoinCode(newCode);
  };

  // ✅ Sauvegarde du nouveau nom de groupe
  const handleSaveName = () => {
    if (groupName.trim() && groupName !== name) {
      onUpdateGroupName(groupName);
    }
    setIsEditingName(false);
  };

  return (
    <Card className="shadow-lg bg-background border border-secondary">
      <CardHeader className="flex items-center">
        {/* ✅ Nom du Groupe avec édition en ligne */}
        <div className={`flex items-center w-full ${isEditingName ? "gap-3" : "justify-between"}`}>
          {isEditingName ? (
            <Input 
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full text-lg font-semibold transition-all"
              autoFocus
            />
          ) : (
            <h1 className="text-2xl font-bold text-foreground transition-all w-full">{groupName}</h1>
          )}

          {isAdmin && (
            <Button 
              variant="outline" 
              className="p-1 flex items-center gap-2 transition-all" 
              onClick={isEditingName ? handleSaveName : () => setIsEditingName(true)}
            >
              {isEditingName ? <MdCheck className="text-success" /> : <MdEdit className="text-accent" />}
              {isEditingName ? "Save" : "Edit"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-secondary space-y-4">
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-3 items-center">
          <MdCalendarToday className="text-gray-500 text-xl" />
          <span className="font-medium text-foreground">{createdAt}</span>
          <span></span>

          <MdVpnKey className="text-gray-500 text-xl" />
          <span className="font-medium text-accent">{currentJoinCode}</span>
          {isAdmin && (
            <Button variant="outline" className="flex items-center gap-2 p-1" onClick={handleRegenerateCode}>
              <MdRefresh className="text-accent" />
              <span>Regenerate</span>
            </Button>
          )}

          <MdPeople className="text-gray-500 text-xl" />
          {isEditingMax ? (
            <Input
              type="number"
              value={maxPart}
              onChange={(e) => setMaxPart(Number(e.target.value))}
              className="w-full text-center"
              min={1}
            />
          ) : (
            <span className="font-medium text-foreground">{maxPart} Participants</span>
          )}
          {isAdmin && (
            <Button 
              variant="outline" 
              className="p-1 flex items-center gap-2" 
              onClick={() => setIsEditingMax(!isEditingMax)}
            >
              <MdEdit className="text-accent" />
            </Button>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 text-right">
            <Button className="bg-success text-white hover:bg-success/80">
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
