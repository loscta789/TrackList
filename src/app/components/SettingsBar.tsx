"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { HiUser, HiColorSwatch } from "react-icons/hi";
import { TbLogout2, TbLogin2, TbSun, TbMoon } from "react-icons/tb";
import Link from "next/link";

interface SettingsBarProps {
  isOpen: boolean;
  closeBar: () => void;
}

export default function SettingsBar({ isOpen, closeBar }: SettingsBarProps) {
  const { isAuthenticated, logout, theme, setTheme } = useAuthStore();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme || "light");

  useEffect(() => {
    if (!isOpen) {
      setIsThemeOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    
    if (!isAuthenticated) {
      setCurrentTheme(storedTheme);
    } else if (theme && theme !== currentTheme) {
      setCurrentTheme(theme);
    }
  }, [theme, isAuthenticated]);
  
  const handleThemeChange = async (newTheme: string) => {
    if (newTheme === currentTheme) return;
  
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // ✅ Met à jour le `<html>`
  
    if (!isAuthenticated) {
      localStorage.setItem("theme", newTheme); // ✅ Stocker pour les utilisateurs non connectés
      useAuthStore.setState({ theme: newTheme }); // ✅ Mettre à jour Zustand immédiatement
    } else {
      await setTheme(newTheme); // ✅ Met à jour la base de données
    }
  
    closeBar();
  };
  
  

  return (
    <div className="w-full bg-background text-foreground shadow-lg flex flex-col justify-between transition-all">
      <div className="px-6 py-4">
        <ul className="space-y-2">
          {/* Profil */}
          <li>
            <Link
              onClick={closeBar}
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary transition-all"
            >
              <HiUser className="text-xl text-primary" />
              <span className="font-medium">Profile</span>
            </Link>
          </li>

          {/* Thème */}
          <li>
            <button
              onClick={() => setIsThemeOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-secondary transition-all bg-accent/20"
            >
              <div className="flex items-center gap-3">
                <HiColorSwatch className="text-xl text-primary" />
                <span className="font-medium">Theme</span>
              </div>
              {currentTheme === "dark" ? <TbMoon className="text-xl" /> : <TbSun className="text-xl" />}
            </button>

            {isThemeOpen && (
              <ul className="pl-6 transition-all duration-300">
                <li>
                  <button
                    className={`p-2 w-full text-left rounded-lg flex items-center transition-all ${
                      currentTheme === "light" ? "bg-primary/20 text-primary font-bold" : "hover:bg-secondary"
                    }`}
                    onClick={() => {
                      handleThemeChange("light");

                    }}
                  >
                    🌞 Light Theme
                  </button>
                </li>
                <li>
                  <button
                    className={`p-2 w-full text-left rounded-lg flex items-center transition-all ${
                      currentTheme === "dark" ? "bg-primary/20 text-primary font-bold" : "hover:bg-secondary"
                    }`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    🌙 Dark Theme
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Connexion / Déconnexion */}
      <div className="px-6 pb-6">
        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              closeBar();
            }}
            
            className="w-full flex items-center gap-3 bg-error text-white p-3 rounded-lg cursor-pointer hover:bg-error/80 transition-all"
          >
            <TbLogout2 className="text-xl" />

            <span className="font-medium">Log Out</span>
          </button>
        ) : (
          <Link
            href="/login"
            onClick={closeBar}
            className="w-full flex items-center gap-3 bg-success text-white p-3 rounded-lg cursor-pointer hover:bg-success/80 transition-all"
          >
            <TbLogin2 className="text-xl" />
            <span className="font-medium">Log In</span>
          </Link>
        )}
      </div>
    </div>
  );
}
