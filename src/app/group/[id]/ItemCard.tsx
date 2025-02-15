import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { IoAlarmOutline } from "react-icons/io5";

interface ItemCardProps {
  item: { id: string; content: string; status?: string; created_at: string };
  userId: string;
  currentUserId: string;
  setExpandedItemId: (id: string | null) => void;
  state: number;
}

export default function ItemCard({ item, userId, currentUserId, setExpandedItemId, state }: ItemCardProps) {
  const createdAtDate = new Date(item.created_at);
  const localCreatedAtDate = new Date(createdAtDate.getTime() - createdAtDate.getTimezoneOffset() * 60000); // Converti en local
  const formattedTime = format(localCreatedAtDate, "h:mm a", { locale: enUS });

  let displayDate;
  const daysAgo = differenceInDays(new Date(), localCreatedAtDate);

  if (isToday(localCreatedAtDate)) {
    displayDate = `Today at ${formattedTime}`;
  } else if (isYesterday(localCreatedAtDate)) {
    displayDate = `Yesterday at ${formattedTime}`;
  } else if (daysAgo > 1 && daysAgo <= 7) {
    displayDate = `${daysAgo} Days Ago at ${formattedTime}`;
  } else {
    displayDate = format(localCreatedAtDate, "MMMM d, yyyy h:mm a");
  }

  return (
    <div className="relative w-full" >
      {/* ✅ Item principal stylisé */}
      <div
        className={`flex justify-between items-center p-2 hover:bg-secondary rounded-lg cursor-pointer transition-all duration-300 
        ${
          state === 1
            ? "text-secondary line-through opacity-50" // ✔️ Terminé → Texte barré + atténué
            : state === 2
            ? "text-success" // 🟢 En cours
            : "text-foreground" // 📝 À faire
        }`}
        onClick={() => setExpandedItemId(item.id)} // 🔥 Ouvre l'overlay via ContributionList
      >
        {/* 📌 Contenu de l'item bien séparé de la date */}
        <div className="flex flex-col">
          <span className="font-medium text-lg truncate">{item.content}</span>
          {/* ✅ Conteneur de l'heure et de l'icône avec effet barré */}
          <div className={`flex items-center gap-2 ${state === 1 ? "line-through opacity-50" : ""}`}>
            <span className="text-secondary text-sm">{displayDate}</span>
            <IoAlarmOutline className="text-secondary" />
          </div>
        </div>

        {/* 📌 Statut dynamique à droite */}
        <div>
          {state === 1 && <span className="text-secondary text-lg font-bold">✔️</span>} {/* Terminé */}
          {state === 2 && <span className="text-success text-lg font-bold">🟢</span>} {/* En cours */}
        </div>
      </div>
    </div>
  );
}
