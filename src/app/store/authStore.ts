import { create } from "zustand";
import { getUser, logoutUser } from "../services/auth";
import { getUserGroups } from "../services/groups";
import { fetchUserProfile, setUserTheme, updateLastGroup } from "../services/users";
import { supabase } from "@/lib/supabaseClient";

interface Group {
  id: string;
  name: string;
}

interface AuthState {
  user: any;
  username: string | null;
  avatar: string | null;
  groups: Group[];
  currentGroup: Group | null;
  theme: string;
  checkAuth: () => Promise<void>;
  setUser: (user: any) => void;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  setCurrentGroup: (groupId: string) => void;
  logout: () => Promise<void>;
  setTheme: (theme: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  username: null,
  avatar: null,
  groups: [],
  currentGroup: null,
  theme:'light',

  checkAuth: async () => {
    console.log("🔄 Exécution de checkAuth()...");

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.warn("⚠️ Aucun utilisateur connecté.");
        return;
      }

      console.log("✅ Session active, récupération de l'utilisateur...");
      const userData = await getUser();
      if (!userData?.id) {
        console.warn("❌ Aucun utilisateur trouvé");
        set({ user: null, username: null, avatar: null, groups: [], currentGroup: null });
        return;
      }

      console.log("✅ Utilisateur trouvé :", userData.id);
      const [profile, groups] = await Promise.all([
        fetchUserProfile(), 
        getUserGroups(userData.id)
      ]);

      const lastGroupId = profile?.last_group_id || null;
      const sortedGroups = [...groups].sort((a, b) => (a.id === lastGroupId ? -1 : b.id === lastGroupId ? 1 : 0));

      // ✅ Met à jour Zustand avec le bon thème
      const userTheme = profile?.theme || get().theme; // 🔥 Si l'utilisateur a un thème, on l'utilise
      localStorage.setItem("theme", userTheme); // ✅ Stocker en local pour les futures visites

      set({
        user: userData,
        username: profile?.username || userData.email.split("@")[0],
        avatar: profile?.avatar_url || null,
        groups: sortedGroups,
        currentGroup: sortedGroups[0] || null,
        theme: userTheme, // ✅ Appliquer le bon thème
      });

    } catch (error) {
      console.error("🚨 Erreur lors de checkAuth :", error);
      set({ user: null, username: null, avatar: null, groups: [], currentGroup: null });
    }
  },

  setUser: (user) => {
    set((state) => {
      if (state.user?.id !== user?.id) {
        getUserGroups(user.id).then((groups) => set({ groups }));
      }
      return { user };
    });
  },

  setTheme: async (theme) => {
    set({ theme }); // ✅ Instantly update Zustand state
  
    // ✅ Immediately update <html data-theme="..."> for Tailwind
    document.documentElement.setAttribute("data-theme", theme);
  
    // ✅ Store in localStorage
    localStorage.setItem("theme", theme);
  
    // 🔥 Update in database only if the user is logged in
    if (get().user) {
      try {
        const updatedTheme = await setUserTheme(theme);
        if (updatedTheme) {
          set({ theme: updatedTheme.theme });
        }
      } catch (error) {
        console.error("❌ Error updating theme in database:", error);
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
    const { user } = get();
    if (!user) return;

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
    set({ user: null, username: null, avatar: null, groups: [], currentGroup: null });
  },
}));
