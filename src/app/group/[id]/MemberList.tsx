interface MemberListProps {
  members: { id: string; username: string; isAdmin: boolean }[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mt-4 text-primary">👥 Membres du groupe</h2>
      <ul className="mt-2">
        {members.map((user) => (
          <li key={user.id} className="bg-secondary p-2 rounded mb-2 text-foreground">
            {user.username} {user.isAdmin && "⭐"}
          </li>
        ))}
      </ul>
    </div>
  );
}
