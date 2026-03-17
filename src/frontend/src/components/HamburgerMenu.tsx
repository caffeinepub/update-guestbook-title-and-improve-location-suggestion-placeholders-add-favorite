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
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          className="w-9 h-9 flex items-center justify-center rounded-md transition-opacity hover:opacity-70"
          style={{ color: "#7B2D1F" }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-lg z-50 overflow-hidden"
            style={{
              backgroundColor: "#f5ede0",
              borderColor: "#c9a96e",
            }}
          >
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#3d2b1a" }}
              onClick={openAbout}
            >
              📖 About VTH Guest Book
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                color: "#3d2b1a",
                borderTop: "1px solid #c9a96e",
              }}
              onClick={openCreateAccount}
            >
              🔑 Create Account / Login
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                color: "#3d2b1a",
                borderTop: "1px solid #c9a96e",
              }}
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
