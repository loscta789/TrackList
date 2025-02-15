"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { fetchChatMessages, sendMessage } from "@/app/services/chat-groups";
import { useAuthStore } from "@/app/store/authStore";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { supabase } from "@/lib/supabaseClient";

interface ChatBoxProps {
  groupId: string;
  onClose: () => void;
}

export default function ChatBox({ groupId, onClose }: ChatBoxProps) {
  const user = useAuthStore((state) => state.user);
  const {username, avatar} = useAuthStore((state) => state);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const messagesRef = useRef(messages); // 🔥 Stocke la version actuelle des messages

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchChatMessages(groupId);
      setMessages(data);
      messagesRef.current = data; // 🔥 Met à jour la ref
    };

    loadMessages();

    // 📌 Abonnement en temps réel à `group_messages`
    const channel = supabase
      .channel(`chat:${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${groupId}` },
        (payload) => {
          console.log("📢 Nouveau message reçu :", payload.new);

          // 🔥 S'assurer que le message ne soit pas ajouté en double
          setMessages((prevMessages) => {
            if (!prevMessages.find((msg) => msg.id === payload.new.id)) {
              return [...prevMessages, payload.new];
            }
            return prevMessages;
          });

          messagesRef.current = [...messagesRef.current, payload.new]; // 🔥 Met à jour la ref
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // 🔥 Crée un message temporaire pour l'afficher immédiatement
    const tempMessage = {
      id: Date.now().toString(), // ID temporaire
      user_id: user.id,
      content: message,
      created_at: new Date().toISOString(),
      profiles: username,
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    messagesRef.current = [...messagesRef.current, tempMessage];

    // 🔥 Envoie à Supabase (il sera remplacé en temps réel)
    await sendMessage(groupId, user.id, message);
    setMessage("");
  };

  // ✅ Fonction pour formater la date
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    if (isToday) return `Today at ${hours}:${minutes} ${ampm}`;
    if (isYesterday) return `Yesterday at ${hours}:${minutes} ${ampm}`;

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${hours}:${minutes} ${ampm}`;
  };

  // 🔥 Auto-scroll vers le bas
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full bg-background text-foreground flex flex-col p-4 border-t border-secondary z-50
                 min-h-[60vh] max-h-[83vh] overflow-y-auto rounded-t-lg backdrop-blur-md"
    >
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">Live Chat</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition">
          <RxCross2 className="text-2xl text-primary" />
        </button>
      </div>

      {/* 🔹 Messages */}
      <div className="h-56 overflow-y-auto border border-secondary rounded-lg p-3 bg-secondary/20 h-full">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="mb-3">
              <div className="text-secondary text-sm flex gap-2 ">
                <strong className="text-primary">{msg.profiles?.username || "Utilisateur inconnu"}</strong>  
                <p className="text-foreground">{formatTimestamp(msg.created_at)}</p>
              </div>
              <p className="text-foreground">{msg.content}</p>
            </div>
          ))
        ) : (
          <p className="text-secondary text-sm">Aucun message pour le moment.</p>
        )}
        <div ref={messagesEndRef} /> {/* 🔥 Pour auto-scroller */}
      </div>

      {/* 🔹 Input de message */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Écrire un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-secondary text-foreground border border-secondary focus:ring-2 focus:ring-primary"
        />
        <Button onClick={handleSendMessage} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition">
          Envoyer
        </Button>
      </div>
    </motion.div>
  );
}
