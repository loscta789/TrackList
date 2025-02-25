"use client";

import { useState } from "react";
import ItemForm from "@/app/group/[id]/_components/ItemForm";
import ActionsButtons from "./ActionsButtons";
import ModalGroupSettings from "./ModalGroupSettings";
import GenerateGroupLinkModal from "./GenerateGroupLinkModal";
import ManageSettings from "./ManageSettings";
import ConfirmAction from "@/app/components/ConfirmAction";
import ChatBox from "./ChatBox";
import { GroupInfo } from "../_typings/groupInterfaces";

interface ActionsAreaProps {
  group: GroupInfo;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
  onToggleShowForm: () => void;
  currentUserId: string | null;

}

export default function ActionsArea({ group, showForm, setShowForm, onToggleShowForm, currentUserId }: ActionsAreaProps) {
  const [settingsForm, setSettingsForm] = useState(false);
  const [isOpenLink, setIsOpenLink] = useState(false);
  const [manageForm, setManageForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [showChat, setShowChat] = useState(false);
  console.log("group", group);
  const currentUserRole = group.members.some((user) => user.id === currentUserId && user.role === "admin");

  return (
    <div className="relative w-full h-full">
      {/* ✅ ChatBox Overlay */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowChat(false)} />
      )}
      {showChat && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <ChatBox groupId={group.id} onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* ✅ Item Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowForm(false)} />
      )}
      {showForm && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <ItemForm
            group={group}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* ✅ Group Settings Overlay */}
      {settingsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSettingsForm(false)} />
      )}
      {settingsForm && (
        <div className="absolute bottom-[calc(100%)] left-0 w-full transition-transform duration-300 z-50 translate-y-0">
          <ModalGroupSettings
            group={group}
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
            group={group}
            onCloseSettings={() => setSettingsForm(false)}
            setIsOpenLink={setIsOpenLink}
            currentUserRole={currentUserRole}
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
        <GenerateGroupLinkModal isOpen={isOpenLink} onClose={() => setIsOpenLink(false)} joinCode={group.joinCode} />
      )}

      {/* ✅ Confirm Action Modal */}
      {confirmAction && <ConfirmAction onClose={() => setConfirmAction(false)} />}
    </div>
  );
}
