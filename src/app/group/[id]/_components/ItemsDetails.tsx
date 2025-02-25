import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/app/components/ui/button";
import { FiClock, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { useEffect } from "react";
import { GroupItem } from "../_typings/groupInterfaces";
import { useAuthStore } from "@/app/store/authStore";
import { fetchDeleteItem, updateItemState } from "@/app/services/items";


interface ItemDetailsProps {
  currentItem: GroupItem
  closeOverlay: () => void;
}

export default function ItemDetails({
  currentItem,
  closeOverlay,

}: ItemDetailsProps) {
  console.log(currentItem, "📌 currentItem");
  const createdAtDate = new Date(currentItem.created_at);
  const formattedTime = format(createdAtDate, "h:mm a", { locale: enUS });
  const userId = useAuthStore((state) => state.user);
  const authorOfItemId = currentItem.user_id;

  let displayDate;
  const daysAgo = differenceInDays(new Date(), createdAtDate);

  if (isToday(createdAtDate)) {
    displayDate = `Today at ${formattedTime}`;
  } else if (isYesterday(createdAtDate)) {
    displayDate = `Yesterday at ${formattedTime}`;
  } else if (daysAgo > 1 && daysAgo <= 7) {
    displayDate = `${daysAgo} Days Ago at ${formattedTime}`;
  } else {
    displayDate = format(createdAtDate, "MMMM d, yyyy h:mm a");
  }

  // ✅ Prevent scrolling on the background when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background bg-opacity-50 flex h-full items-center justify-center z-50 px-4 sm:px-6">
      <div className="relative bg-background h-full text-foreground w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl min-h-[80vh] sm:min-h-[60vh] rounded-lg shadow-xl overflow-hidden">
        {/* 🔹 Header */}
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold text-primary">{currentItem.content}</h2>
          <p className="text-xs sm:text-sm text-secondary italic">
            Added by {currentItem.username}, {displayDate}
          </p>
        </div>

        {/* 🔹 Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh]">
          {/* 📝 Description */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-md sm:text-lg font-semibold text-accent">📝 Description</h3>
            <p className="text-sm sm:text-md text-secondary mt-2">
              {currentItem.details ? currentItem.details : "No additional details."}
            </p>
          </div>

          {/* 📌 Update status */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-md sm:text-lg font-semibold text-accent">📌 Update Status</h3>
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <Button
                className="flex-1 flex items-center justify-center gap-2 bg-warning text-white hover:bg-warning/80"
                onClick={() => {
                  updateItemState(currentItem.id, 2);
                  closeOverlay();
                }}
              >
                <FiClock />
                In Progress
              </Button>
              <Button
                className="flex-1 flex items-center justify-center gap-2 bg-success text-white hover:bg-success/80"
                onClick={() => {
                  updateItemState(currentItem.id, 1);
                  closeOverlay();
                }}
              >
                <FiCheckCircle />
                Purchased
              </Button>
            </div>
          </div>

          {/* 🗑️ Delete Button (Only if user owns the item) */}
          {userId === authorOfItemId && (
            <div className="pb-4 mb-4">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-error text-white hover:bg-error/80"
                onClick={() => fetchDeleteItem(currentItem.id)}
              >
                <FiTrash2 />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* 🔹 Footer (Close Button) */}
        <div className="p-5 sm:p-6 border-t flex justify-center">
          <Button variant="outline" onClick={closeOverlay} className="w-full max-w-sm">
            ❌ Close
          </Button>
        </div>
      </div>
    </div>
  );
}
