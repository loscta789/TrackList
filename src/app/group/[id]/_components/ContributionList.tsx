import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import ActionsArea from "./ActionsArea";
import ItemDetails from "./ItemsDetails";
import { Button } from "@/app/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { GroupInfo, GroupItem } from "../_typings/groupInterfaces";
interface ContributionListProps {
  group:GroupInfo;
  currentUserId:string | null,

}

export default function ContributionList({
  group,
  currentUserId,

}: ContributionListProps) {


  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  console.log("📌 expandedItemId", expandedItemId);
  const selectedItem: GroupItem | null = 
  group.members.flatMap(member => member.items)
  .find((item) => item.id === expandedItemId) || null;


  useEffect(() => {
    if (selectedItem) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [selectedItem]);

/*   useEffect(() => {
    const channel = supabase
      .channel(`group_items:${groupId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_items", filter: `group_id=eq.${groupId}` },
        (payload) => {
          console.log("📢 Mise à jour en temps réel reçue :", payload);

          if (payload.eventType === "INSERT") {
            setAllItems((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setAllItems((prev) =>
              prev.map((item) => (item.id === payload.new.id ? { ...item, ...payload.new } : item))
            );
          } else if (payload.eventType === "DELETE") {
            setAllItems((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]); */

/*   useEffect(() => {
    if (selectedItem) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [selectedItem]); */

  return (
    <div className="relative bg-background text-foreground h-full w-full  flex flex-col">
      {/* ✅ Liste des Contributions (prend toute la hauteur restante et scrollable) */}
      <div className="relative w-full h-[90vh] overflow-y-auto p-2">
        <div className=" flex flex-col gap-2 ">
            {group.members.some(member => member.items.length > 0) ? (
              group.members.map((member) => (
                member.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-1 transition cursor-pointer border-b border-secondary"
                    onClick={() => setExpandedItemId(item.id)}>
                  
                    <ItemCard
                      item={item}
                    />
                  </div>))

            ))
          ) : (
            <p className="text-secondary italic">No contributions yet.</p>
          )}

          
      </div>
      
      <div className="flex mb-4 mt-4 px-2">
          <Button 
            className="flex items-center gap-2 px-8 py-3  bg-success text-white rounded-lg shadow-lg hover:bg-success/80 transition"
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
          group={group}
          showForm={showForm}
          setShowForm={setShowForm}
          currentUserId={currentUserId}
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
              currentItem={selectedItem}
              closeOverlay={() => setExpandedItemId(null)}

/*               updateItem={(id, newState) => {
                setAllItems(allItems.map(item => item.id === id ? { ...item, state: newState === "process" ? 2 : 1 } : item));
                setExpandedItemId(null);
              }}
              deleteItem={(id, userId) => setAllItems(allItems.filter(item => item.id !== id))} 
               */
            />
          </div>
        </div>
      )}
    </div>
  );
}
