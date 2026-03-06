import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import AboutDialog from "./AboutDialog";
import CreateAccountDialog from "./CreateAccountDialog";
import HowToUseDialog from "./HowToUseDialog";

export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const openAbout = () => {
    setMenuOpen(false);
    setAboutOpen(true);
  };
  const openCreateAccount = () => {
    setMenuOpen(false);
    setCreateAccountOpen(true);
  };
  const openHowToUse = () => {
    setMenuOpen(false);
    setHowToUseOpen(true);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          className="text-logo-title hover:bg-white/10"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              onClick={openAbout}
            >
              📖 About VTH Guest Book
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-t border-border"
              onClick={openCreateAccount}
            >
              🔑 Create Account / Login
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-t border-border"
              onClick={openHowToUse}
            >
              🗺️ How to Use
            </button>
          </div>
        )}
      </div>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <CreateAccountDialog
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
      />
      <HowToUseDialog open={howToUseOpen} onOpenChange={setHowToUseOpen} />
    </>
  );
}
