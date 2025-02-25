

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

export { formatTimestamp };