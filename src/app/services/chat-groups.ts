export async function fetchChatMessages(groupId: string) {
  const res = await fetch(`/api/chat/messages?groupId=${groupId}`);
  const data = await res.json();

  console.log(data)
  return data.messages;
}

export async function sendMessage(groupId: string, content: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupId, content }),
    credentials: "include",
  });


  const data = await res.json();

  if (!res.ok) {
    console.log("Data pas ok")
  }
  console.log("📦 Message envoyé au client :", { message: data });
  return data.message;
}
