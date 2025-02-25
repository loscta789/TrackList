"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import {
  MdExpandMore,
  MdExpandLess,
  MdHome,
  MdAttachMoney,
  MdContacts,
  MdGroup,
} from "react-icons/md";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  closeBar?: () => void;
}

export default function Sidebar({ isOpen, closeBar }: SidebarProps) {
  const { isAuthenticated, groups = [], currentGroup, setCurrentGroup, logout } = useAuthStore();
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);


  useEffect(() => {
    if (!isOpen) {
      setIsGroupsOpen(false);
    }
  }, [isOpen]);

  const handleToggleGroups = () => setIsGroupsOpen((prev) => !prev);

  return (
    <div className="w-full bg-background text-foreground shadow-lg transition-all">
      <div className="px-6 py-4">
        {/* Navigation principale */}
        <ul className="space-y-2">
          <li>
            <Link
              onClick={closeBar}
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary transition-all"
            >
              <MdHome className="text-xl text-primary" />
              <span className="font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeBar}
              href="/pricing"
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary transition-all"
            >
              <MdAttachMoney className="text-xl text-primary" />
              <span className="font-medium">Pricing</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeBar}
              href="/contact"
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary transition-all"
            >
              <MdContacts className="text-xl text-primary" />
              <span className="font-medium">Contact</span>
            </Link>
          </li>

          {/* Sous-menu Groups */}
          {isAuthenticated && groups.length > 0 && (
            <li>
              <button
                onClick={handleToggleGroups}
                className="w-full flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-secondary transition-all bg-accent/20"
              >
                <div className="flex items-center gap-3">
                  <MdGroup className="text-xl text-primary" />
                  <span className="font-medium">Groups</span>
                </div>
                {isGroupsOpen ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
              </button>

              {isGroupsOpen && (
                <ul className="pl-6 transition-all duration-300">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <Link
                        href={`/group/${group.id}`}
                        onClick={() => {
                          closeBar?.();
                          if (currentGroup?.id !== group.id) {
                            setCurrentGroup(group.id);
                          }
                        }}
                        
                        className={`p-2 rounded-lg flex items-center transition-all ${
                          currentGroup?.id === group.id
                            ? "bg-primary/20 text-blue-500 font-bold"
                            : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        {group.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>

        <hr className="my-4 border-secondary" />

        {/* Boutons Connexion / Déconnexion */}
        <div className="flex gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                onClick={closeBar}
                href="/login"
                className="w-1/2 text-center bg-secondary text-foreground font-medium p-3 rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                Se connecter
              </Link>
              <Link
                onClick={closeBar}
                href="/register"
                className="w-1/2 text-center bg-success text-white font-medium p-3 rounded-lg hover:bg-success/80 transition-all"
              >
                Start free!
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  logout();
                  closeBar?.();
                }}
                
                className="w-1/2 text-center bg-secondary text-foreground font-medium p-3 rounded-lg hover:bg-error hover:text-white transition-all"
              >
                Logout
              </button>
              <Link
                onClick={closeBar}
                href="/recommend"
                className="w-1/2 text-center bg-process text-white font-medium p-3 rounded-lg hover:bg-process/80 transition-all"
              >
                Recommend us!
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
