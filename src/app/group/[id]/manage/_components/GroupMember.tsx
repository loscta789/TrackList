"use client";

import { MdMoreVert, MdAdminPanelSettings, MdPersonRemove} from "react-icons/md";
import { Button } from "@/app/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";

interface GroupMemberProps {
  member: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
  isAdmin: boolean;
  onRemoveMember: (userId: string) => void;
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
}

export default function GroupMember({ member, isAdmin, onRemoveMember, onToggleAdmin }: GroupMemberProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-secondary">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-lg font-medium text-foreground">{member.username}</p>
          <p className="text-sm text-secondary">{member.isAdmin ? "Admin" : "Member"}</p>
        </div>
      </div>

      {isAdmin && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-2">
              <MdMoreVert className="text-xl text-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-background shadow-lg rounded-lg p-2 border border-secondary">
            <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded w-full" onClick={() => onToggleAdmin(member.id, !member.isAdmin)}>
              <MdAdminPanelSettings className="text-accent" />
              {member.isAdmin ? "Revoke Admin" : "Make Admin"}
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded w-full text-error" onClick={() => onRemoveMember(member.id)}>
              <MdPersonRemove />
              Remove from Group
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
