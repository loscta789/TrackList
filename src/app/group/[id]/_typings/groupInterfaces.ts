export interface GroupInfo {
    id: string;
    name: string;
    joinCode: string;
    created_at: string;
    max_participants: number;
    members: GroupMember[];
  }
  
  export interface GroupMember {
    id: string;
    username: string;
    role: string;
    avatar: string;
    joined_at: string;
    items: GroupItem[];
  }
  
  export interface GroupItem {
    id: string;
    content: string;
    state: number;
    details: string;
    created_at: string;
    username: string;
    avatar: string;
    user_id: string;
  }
  