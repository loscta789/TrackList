import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import ActionsArea from "./ActionsArea";
import ItemDetails from "./ItemsDetails";
import { Button } from "@/app/components/ui/button";
import { FiPlus } from "react-icons/fi";

interface ContributionListProps {
  members: {
    id: string;
    username: string;
    role: string;
    items: { id: string; content: string; state: number; details: string; created_at: string }[];
  }[];
  groupId: string;
  groupName: string;
  joinCode: string;
  currentUserId: string;
}

export default function ContributionList({
  members,
  groupId,
  currentUserId,
  groupName,
  joinCode,
}: ContributionListProps) {
  const currentUserRole = members.some((user) => user.id === currentUserId && user.role === "admin");
  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [allItems, setAllItems] = useState(
    members.flatMap((user) =>
      user.items.map((item) => ({
        ...item,
        username: user.username,
        userId: user.id,
        details: item.details,
      }))
    )
  );
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const selectedItem = allItems.find((item) => item.id === expandedItemId) || null;
  const isItemOpen = !!selectedItem;

  useEffect(() => {
    if (selectedItem) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [selectedItem]);

  return (
    <div className="relative bg-background text-foreground h-full w-full flex flex-col">
      {/* ✅ Liste des Contributions (prend toute la hauteur restante et scrollable) */}
      <div className="relative w-full h-[90vh] overflow-y-auto p-2">
        <div className=" flex flex-col gap-2 ">
            {allItems.length > 0 ? (
              allItems.map((item) => (
                <div
                  key={item.id}
                  className="p-1 transition cursor-pointer border-b border-secondary"
                  onClick={() => setExpandedItemId(item.id)}
                >
                  <ItemCard
                    item={{ ...item, content: `${item.content} (${item.username})` }}
                    userId={item.userId}
                    currentUserId={currentUserId}
                    setExpandedItemId={setExpandedItemId}
                    state={item.state}
                  />
        </div>
            ))
          ) : (
            <p className="text-secondary italic">No contributions yet.</p>
          )}

          
      </div>
      
      <div className="flex mb-4 mt-4 px-2">
          <Button 
            className="flex items-center gap-2 px-8 py-3 mb-5 bg-success text-white rounded-lg shadow-lg hover:bg-success/80 transition"
            onClick={() => setShowForm(true)}
          >
            <FiPlus />
            Add Item
          </Button>
        </div>

        {/* ✅ Bouton pour ajouter un élément (toujours sous le dernier élément) */}
        
      </div>

      {/* 📌 Footer fixe contenant ActionsArea */}
      <div id="actions-area" className="fixed bottom-0 left-0 w-full bg-background shadow-md border-t border-secondary z-50">
        <ActionsArea
          userId={currentUserId}
          groupId={groupId}
          members={members}
          onItemAdded={(item) => setAllItems([...allItems, item])}
          groupName={groupName}
          joinCode={joinCode}
          currentUserRole={currentUserRole}
          showForm={showForm}
          setShowForm={setShowForm}
          onToggleShowForm={() => setShowForm(!showForm)}
        />
      </div>

      {/* 📌 Overlay qui affiche les détails d'un item sélectionné */}
      {selectedItem && (
        <div
          className="fixed left-0 w-full h-full bg-black bg-opacity-50 flex"
          onClick={() => setExpandedItemId(null)}
        >
          {/* Modale qui glisse depuis la gauche */}
          <div
            className={`  w-3/4 h-full bg-background text-foreground p-6 shadow-lg border-r border-secondary transition-transform duration-300 ease-in-out ${
              isAnimating ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ItemDetails
              item={selectedItem}
              userId={selectedItem.userId}
              currentUserId={currentUserId}
              closeOverlay={() => setExpandedItemId(null)}
              updateItem={(id, newState) => {
                setAllItems(allItems.map(item => item.id === id ? { ...item, state: newState === "process" ? 2 : 1 } : item));
                setExpandedItemId(null);
              }}
              author={selectedItem.username}
              state={selectedItem.state}
              deleteItem={(id, userId) => setAllItems(allItems.filter(item => item.id !== id))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
