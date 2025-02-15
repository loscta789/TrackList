export async function fetchChatMessages(groupId: string) {
  const res = await fetch(`/api/chat/messages?groupId=${groupId}`);
  const data = await res.json();
  return data.messages;
}

export async function sendMessage(groupId: string, userId: string, content: string) {
  const res = await fetch("/api/chat/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupId, userId, content }),
  });

  const data = await res.json();
  return data.message;
}
