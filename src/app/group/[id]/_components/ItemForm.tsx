"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { fetchAddItem } from "@/app/services/items";
import { GroupInfo } from "@/app/group/[id]/_typings/groupInterfaces";

interface ItemFormProps {
  group:GroupInfo
  onClose: () => void;
  
 
  
}

export default function ItemForm({
  group,
  onClose,
  
}: ItemFormProps) {
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDetails, setNewItemDetails] = useState("");
  const [error, setError] = useState("");

  const addItem = async () => {
    if (!newItemTitle.trim()) return;

    const newItemFromServer = await fetchAddItem(group.id, newItemTitle, newItemDetails);

    if (!newItemFromServer) {
      setError(newItemFromServer.error);
    }

    console.log("Item ajouté")

    setNewItemTitle("");
    setNewItemDetails("");
    onClose();
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full bg-background text-foreground flex flex-col p-6 border-t border-secondary z-50
                 max-h-[60vh] overflow-y-auto rounded-t-2xl backdrop-blur-md shadow-t-lg"
    >
      {/* 🔹 Header */}
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">📝 Add an Item</h2>

      {/* 🔹 Input Titre */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary">Item title</label>
        <Input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Nom du produit..."
          className="mt-1 border border-secondary"
        />
      </div>

      {/* 🔹 Input Détails */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-secondary">Additional details</label>
        <Textarea
          value={newItemDetails}
          onChange={(e) => setNewItemDetails(e.target.value)}
          placeholder="Exemple : 2kg, sans sel, etc..."
          className="mt-1 border border-secondary"
        />
      </div>

      {/* 🔹 Boutons d'action */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-success text-white hover:bg-success/80" onClick={addItem}>
          ✅ Add Item
        </Button>
        <Button className="flex-1 bg-error text-white hover:bg-error/80" onClick={onClose}>
          ❌ Cancel
        </Button>
      </div>
    </motion.div>
  );
}
