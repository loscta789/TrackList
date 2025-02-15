"use client";
import { useState, useEffect } from "react";

export default function GroupList() {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchGroups() {
      const res = await fetch("/api/group/my-groups");
      const data = await res.json();
      setGroups(data.groups);
    }
    fetchGroups();
  }, []);

  return (
    <ul className="mt-2 space-y-2">
      {groups.length === 0 ? (
        <p className="text-secondary italic">Aucun groupe trouvé.</p>
      ) : (
        groups.map((group) => (
          <li key={group.id} className="p-2 bg-secondary rounded cursor-pointer hover:bg-secondary/80 transition">
            {group.name}
          </li>
        ))
      )}
    </ul>
  );
}
