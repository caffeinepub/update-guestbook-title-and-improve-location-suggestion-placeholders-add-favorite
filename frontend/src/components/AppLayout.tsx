import React from 'react';
import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Map, Globe, PenLine } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';

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
    { path: '/', label: 'Feed', icon: BookOpen },
    { path: '/add', label: 'Sign', icon: PenLine },
    { path: '/world-map', label: 'World', icon: Globe },
    { path: '/at-map', label: 'AT Map', icon: Map },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-logo-bg border-b border-logo-border shadow-logo">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo area */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            aria-label="Go to home"
          >
            {/* Emblem badge */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-logo-emblem border-2 border-logo-border shadow-sm overflow-hidden">
              <img
                src="/assets/generated/atvth-logo.dim_512x512.png"
                alt="VTH emblem"
                className="w-9 h-9 object-contain"
              />
            </div>
            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span
                className="text-logo-title font-extrabold tracking-widest uppercase"
                style={{ fontSize: '1.35rem', letterSpacing: '0.18em' }}
              >
                VTH
              </span>
              <span className="text-logo-subtitle text-xs tracking-wide font-medium">
                Guest Book
              </span>
            </div>
          </button>

          {/* Right side: logout if authenticated + hamburger */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-logo-subtitle hover:text-logo-title transition-colors px-2 py-1 rounded"
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

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto flex">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate({ to: path })}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive(path)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="fixed bottom-16 left-0 right-0 pointer-events-none">
        {/* intentionally empty - attribution in page footer */}
      </footer>
    </div>
  );
}
