import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { BookOpen, Globe, Map as MapIcon, PenLine } from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import HamburgerMenu from "./HamburgerMenu";

// Brand color constants — explicit hex for reliable cross-browser rendering
const BRAND = {
  headerBg: "#e8d9bc",
  headerBorder: "#c9a96e",
  emblemBg: "#8B3A2A",
  titleColor: "#7B2D1F",
  subtitleColor: "#2D5A27",
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { path: "/", label: "Feed", icon: BookOpen },
    { path: "/add", label: "Sign", icon: PenLine },
    { path: "/world-map", label: "World", icon: Globe },
    { path: "/at-map", label: "Trail Map", icon: MapIcon },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f5ede0" }}
    >
      {/* Header — z-index 1100 to sit above Leaflet map controls (max ~800) */}
      <header
        className="sticky top-0 border-b shadow-md"
        style={{
          backgroundColor: BRAND.headerBg,
          borderColor: BRAND.headerBorder,
          zIndex: 1100,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo area */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            aria-label="Go to home"
            data-ocid="nav.link"
          >
            {/* VTH Emblem Badge — 48x48 */}
            <div
              className="flex-shrink-0 rounded-xl border-2 flex items-center justify-center shadow"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: BRAND.emblemBg,
                borderColor: BRAND.headerBorder,
              }}
            >
              <span
                className="font-black text-white select-none"
                style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}
              >
                VTH
              </span>
            </div>
            {/* Wordmark */}
            <div className="flex flex-col leading-none gap-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-black tracking-widest uppercase"
                  style={{
                    fontSize: "2.2rem",
                    letterSpacing: "0.12em",
                    color: BRAND.titleColor,
                  }}
                >
                  VTH
                </span>
                <span
                  className="font-semibold tracking-wide uppercase"
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    color: BRAND.subtitleColor,
                  }}
                >
                  Guest Book
                </span>
              </div>
              <span
                className="font-medium text-xs tracking-wide"
                style={{ color: BRAND.subtitleColor }}
              >
                Vicarious Thru-Hikers
              </span>
            </div>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs px-2 py-1 rounded transition-colors hover:opacity-80"
                style={{ color: BRAND.subtitleColor }}
                data-ocid="nav.button"
              >
                Logout
              </button>
            )}
            <HamburgerMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation — z-index 1100 to match header */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t"
        style={{
          backgroundColor: "#f5ede0",
          borderColor: BRAND.headerBorder,
          zIndex: 1100,
        }}
      >
        <div className="max-w-2xl mx-auto flex">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              type="button"
              key={path}
              onClick={() => navigate({ to: path })}
              data-ocid="nav.link"
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
              style={{
                color: isActive(path) ? BRAND.emblemBg : "#888",
              }}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
