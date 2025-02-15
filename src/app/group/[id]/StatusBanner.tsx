export default function StatusBanner({ members }) {
    const allItems = members.flatMap((user) => user.items);
    const allPending = allItems.every((item) => item.status === "En cours");
  
    return (
      <div className="p-2 text-center bg-gray-800 text-white rounded mb-4">
        {allPending ? "🛒 Personne n'a encore pris la commande" : "✅ Commande en cours"}
      </div>
    );
  }
  