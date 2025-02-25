import { create } from "zustand";
import { getUser, logoutUser } from "../services/auth";
import { getUserGroups } from "../services/groups";
import { fetchUserProfile, setUserTheme, updateLastGroup } from "../services/users";
import {persist} from "zustand/middleware";
import { supabase } from "@/lib/supabaseClient";

interface Group {
  id: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  avatar: string | null;
  groups: Group[];
  currentGroup: Group | null;
  theme: string;
  checkAuth: () => Promise<void>;
  setUser: (user: any) => Promise<void>;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  setCurrentGroup: (groupId: string) => void;
  logout: () => Promise<void>;
  setTheme: (theme: string) => void;
  hasCheckingAuth: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean,


}

export const useAuthStore = create(persist<AuthState>(
  (set, get) => ({
  isAuthenticated: false,
  user: null,
  username: null,
  avatar: null,
  groups: [],
  currentGroup: null,
  theme:'light',
  hasCheckingAuth: false,
  isCheckingAuth: false,
  isLoading: true,

  checkAuth: async () => {
    console.log("🔄 Exécution de checkAuth()...");

    if (get().isAuthenticated) {
      console.log("Session found in Zustand, restoring...")
      set({isLoading:false})
      return;

    }

    const { data, error} = await supabase.auth.getSession();

    if (error || !data.session) {
      console.warn("⚠️ Aucun utilisateur connecté.");
      set({ isAuthenticated: false, username: null, avatar: null, groups: [], currentGroup: null, isLoading: false });
      return;
    }

    console.log("✅ Session active, récupération de l'utilisateur...");

      const userData = await getUser();
      if (!userData?.id) {
        console.warn("❌ Aucun utilisateur trouvé");
        set({isAuthenticated: false, username: null, avatar: null, groups: [], currentGroup: null, isLoading: false });
        return;
      }

      console.log("✅ Utilisateur trouvé :", userData.id);

      const [profile, groups] = await Promise.all([ //Fetch user profile and groups
        fetchUserProfile(), 
        getUserGroups(userData.id)
      ]);

      const lastGroupId = profile?.last_group_id || null;
      const sortedGroups = [...groups].sort((a, b) => (a.id === lastGroupId ? -1 : b.id === lastGroupId ? 1 : 0));


      set({
        isAuthenticated: true,
        username: profile?.username || userData.email.split("@")[0],
        avatar: profile?.avatar_url || null,
        groups: sortedGroups,
        currentGroup: sortedGroups[0] || null,
        theme: profile?.theme || "light", // ✅ Appliquer le bon thème
        isLoading: false,
      });

      
  },

  setUser: async (user) => {
    if (!user) return;

    set({
      isAuthenticated: true,
      username: user.username || user.email.split("@")[0], // ✅ Use email as fallback
      avatar: user.avatar_url || null,
    });

    
  },

  setTheme: async (theme) => {
    set({ theme }); // ✅ Met à jour Zustand immédiatement
  
    document.documentElement.setAttribute("data-theme", theme); // ✅ Applique immédiatement le thème

    if (get().isAuthenticated) {
      try {
        const updatedTheme = await setUserTheme(theme);
        if (updatedTheme) {
          set({ theme: updatedTheme.theme });
        }
      } catch (error) {
        console.error("❌ Erreur mise à jour du thème dans la DB :", error);
      }
    }
  },
  
  
  
  

  setGroups: (groups) => {
    const { currentGroup } = get();
    const lastGroupId = currentGroup?.id || null;
    const sortedGroups = [...groups].sort((a, b) => (a.id === lastGroupId ? -1 : b.id === lastGroupId ? 1 : 0));
    set({ groups: sortedGroups });

    if (!currentGroup || !sortedGroups.some((g) => g.id === currentGroup.id)) {
      set({ currentGroup: sortedGroups[0] || null });
    }
  },

  addGroup: (group) => {
    set((state) => ({
      groups: [...state.groups, group],
      currentGroup: state.currentGroup ?? group,
    }));
  },

  setCurrentGroup: async (groupId) => {
/*     const { user } = get();
    if (!user) return; */

    set({ currentGroup: { id: groupId, name: "Loading..." } });

    try {
      await updateLastGroup(groupId);
      set({ currentGroup: { id: groupId, name: "Updated Group" } });
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du dernier groupe :", error);
    }
  },

  logout: async () => {
    await logoutUser();
    set({ isAuthenticated: false, username: null, avatar: null, groups: [], currentGroup: null });
  },
})
, {
  name: "auth-storage",
}));
