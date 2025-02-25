"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { fetchChatMessages, sendMessage } from "@/app/services/chat-groups";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { supabase } from "@/lib/supabaseClient";
import { formatTimestamp } from "@/app/services/utils";
interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { username: string };
}

interface ChatBoxProps {
  groupId: string;
  onClose: () => void;
}

export default function ChatBox({ groupId, onClose }: ChatBoxProps) {


  const [messages, setMessages] = useState<
  ChatMessage[]
>([]);
  const [message, setMessage] = useState("");
  const messagesRef = useRef(messages); // 🔥 Stocke la version actuelle des messages

  useEffect(() => {
    const loadMessages = async () => {
      const messagesData = await fetchChatMessages(groupId);
      console.log("📩 Messages reçus dans ChatBox :", messagesData);
  
      if (Array.isArray(messagesData)) {
        setMessages(messagesData);
        console.log("✅ État `messages` mis à jour :", messagesData);
      } else {
        console.error("⚠️ Erreur : messagesData n'est pas un tableau", messagesData);
      }
    };

    loadMessages();

    // 📌 Abonnement en temps réel à `group_messages`
    const channel = supabase
  .channel(`chat:${groupId}`)
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${groupId}` },
    async (payload) => {
      console.log("📢 Nouveau message reçu payload:", payload.new);

      // 🔥 Récupérer le username directement avec `user_id`
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", payload.new.user_id)
        .single();

      if (error) {
        console.error("❌ Erreur lors de la récupération du username :", error);
      }

      // 🔥 Mettre à jour `payload.new` avec le username récupéré
      payload.new.profiles = profile ? { username: profile.username } : { username: "Utilisateur inconnu" };

      // ✅ Ajouter le message dans la liste
      setMessages((prevMessages) => {
        if (!prevMessages.find((msg) => msg.id === payload.new.id)) {
          return [
            ...prevMessages,
            {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              user_id: payload.new.user_id,
              profiles: { username: payload.new.profiles.username },
            },
          ];
        }
        return prevMessages;
      });

      messagesRef.current = [
        ...messagesRef.current,
        {
          id: payload.new.id,
          content: payload.new.content,
          created_at: payload.new.created_at,
          user_id: payload.new.user_id,
          profiles: { username: payload.new.profiles.username },
        },
      ];
    }
  )
  .subscribe();


    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // 🔹 Envoie le message à Supabase
    const newMessage = await sendMessage(groupId, message);

    if (!newMessage) {
      console.error("❌ Le message retourné est NULL ou UNDEFINED !");
    } else {
      console.log("✅ Message reçu :", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    }


    setMessage(""); // 🔥 Réinitialise l'input après envoi
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
