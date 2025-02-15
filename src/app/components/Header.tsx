"use client";

import { useState, useEffect } from "react";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import Sidebar from "./Sidebar";
import SettingsBar from "./SettingsBar";
import Image from "next/image";
import { IoMdNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import Link from "next/link";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    const sidebar = document.getElementById("sidebar-menu");
    if (sidebar) {
      setMenuHeight(isSidebarOpen ? sidebar.scrollHeight : 0);
    }
  }, [isSidebarOpen]);

  return (
    <>
      {/* 🔹 Header fixe en haut */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background text-foreground border-b border-secondary shadow-md">
        <nav className="p-4 h-[8vh] flex items-center justify-between">
          {/* Logo et menu */}
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsSettingsOpen(false);
              }}
              className="text-4xl p-2 hover:text-primary transition-transform hover:scale-105"
            >
              {isSidebarOpen ? <IoClose /> : <IoMenuSharp />}
            </button>

            {/* <Link href="/">
              <Image
                src="/apple-logo.svg"
                alt="logo"
                width={70}
                height={56}
                className="transition-transform hover:scale-105"
              />
            </Link> */}
          </div>

          {/* Icônes Notifications & Paramètres */}
          <div className="text-3xl flex items-center gap-4">
            <IoMdNotifications className="cursor-pointer hover:text-primary transition-all" />
            <IoIosSettings
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setIsSidebarOpen(false);
              }}
              className="cursor-pointer hover:text-primary transition-all"
            />
          </div>
        </nav>

        {/* 🔹 Sidebar (Menu principal) */}
        <div
          id="sidebar-menu"
          className={`absolute top-[8vh] left-0 w-full bg-background shadow-lg border-b border-secondary transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} closeBar={() => setIsSidebarOpen(false)} />
        </div>

        {/* 🔹 SettingsBar (Menu paramètres) */}
        <div
          id="settings-menu"
          className={`absolute top-[8vh] left-0 w-full bg-background shadow-lg border-b border-secondary transition-all duration-300 overflow-hidden ${
            isSettingsOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <SettingsBar isOpen={isSettingsOpen} closeBar={() => setIsSettingsOpen(false)} />
        </div>
      </header>

      {/* 🔹 Overlay pour sidebar et settings */}
      {(isSidebarOpen || isSettingsOpen) && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsSettingsOpen(false);
          }}
        ></div>
      )}

      {/* 🔹 Gestion dynamique de l'espace du contenu */}
      <div style={{ marginTop: `calc(8vh + ${menuHeight}px)` }} />
    </>
  );
}
