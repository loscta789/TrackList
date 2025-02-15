"use client";

import { useState } from "react";
import ItemForm from "@/app/components/ItemForm";
import { fetchAddItem } from "@/app/services/items";
import ActionsButtons from "./ActionsButtons";
import GroupSettings from "./GroupSettings";
import GenerateGroupLinkModal from "./GenerateGroupLinkModal";
import ManageSettings from "./ManageSettings";
import ConfirmAction from "@/app/components/ConfirmAction";
import ChatBox from "./ChatBox";

interface ActionsAreaProps {
  userId: string;
  groupId: string;
  groupName: string;
  joinCode: string;
  currentUserRole: boolean;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
  onToggleShowForm: () => void;
  members: {
    id: string;
    username: string;
    items: { id: string; content: string; state: number; created_at: string };
  }[];
  onItemAdded: (item: { 
    id: string; 
    content: string; 
    details: string; 
    username: string;
    userId: string;
    state: number;
    created_at: string;
  }) => void;
}

export default function ActionsArea({ userId, groupId, onItemAdded, members, groupName, joinCode, currentUserRole, showForm, setShowForm, onToggleShowForm }: ActionsAreaProps) {
  const [settingsForm, setSettingsForm] = useState(false);
  const [isOpenLink, setIsOpenLink] = useState(false);
  const [manageForm, setManageForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* ✅ ChatBox Overlay */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowChat(false)} />
      )}
      {showChat && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <ChatBox groupId={groupId} onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* ✅ Item Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowForm(false)} />
      )}
      {showForm && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <ItemForm
            userId={userId}
            groupId={groupId}
            onItemAdded={onItemAdded}
            members={members}
            onClose={() => setShowForm(false)}
            fetchAddItem={fetchAddItem}
            onCloseSettings={() => setSettingsForm(false)}
          />
        </div>
      )}

      {/* ✅ Group Settings Overlay */}
      {settingsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSettingsForm(false)} />
      )}
      {settingsForm && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <GroupSettings
            groupId={groupId}
            groupName={groupName}
            joinCode={joinCode}
            onClose={() => setShowForm(false)}
            onCloseSettings={() => setSettingsForm(false)}
            currentUserRole={currentUserRole}
            setIsOpenLink={setIsOpenLink}
            onOpen={() => setConfirmAction(true)}
          />
        </div>
      )}

      {/* ✅ Manage Settings Overlay */}
      {manageForm && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <ManageSettings
            groupId={groupId}
            groupName={groupName}
            joinCode={joinCode}
            onClose={() => setShowForm(false)}
            onCloseSettings={() => setSettingsForm(false)}
            currentUserRole={currentUserRole}
            setIsOpenLink={setIsOpenLink}
          />
        </div>
      )}

      {/* ✅ Actions Buttons */}
      <div className="relative">
        <ActionsButtons
          onOpenForm={() => setShowForm(true)}
          onOpenSettings={() => setSettingsForm(true)}
          onClose={() => setShowForm(false)}
          onCloseSettings={() => setSettingsForm(false)}
          onToggleSettingsForm={() => setSettingsForm(!settingsForm)}
          onToggleShowForm={onToggleShowForm}
          onToggleChat={() => setShowChat(prev => !prev)}
          onCloseChat={() => setShowChat(false)}
        />
      </div>

      {/* ✅ Generate Group Link Modal */}
      {isOpenLink && (
        <GenerateGroupLinkModal isOpen={isOpenLink} onClose={() => setIsOpenLink(false)} joinCode={joinCode} />
      )}

      {/* ✅ Confirm Action Modal */}
      {confirmAction && <ConfirmAction onClose={() => setConfirmAction(false)} />}
    </div>
  );
}
