import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Plus, MapPin, Mountain, Info, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AboutDialog from './AboutDialog';

export default function AppLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [showAbout, setShowAbout] = useState(false);

  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/vth-logo.dim_512x512.png" 
              alt="VTH Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-foreground">VTH Guest Book</h1>
              <p className="text-xs text-muted-foreground">Vicarious Thru-Hikers</p>
            </div>
          </div>

          {/* Login / Logout button */}
          <Button
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="shrink-0"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Logging in...</span>
              </>
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Login</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container space-y-3">
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAbout(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} · Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'vth-guestbook'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 w-full border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex items-center justify-around py-2">
          <Button
            variant={currentPath === '/' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="flex-col h-auto py-2 px-4 gap-1"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Feed</span>
          </Button>
          <Button
            variant={currentPath === '/add' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: '/add' })}
            className="flex-col h-auto py-2 px-4 gap-1"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Sign</span>
          </Button>
          <Button
            variant={currentPath === '/world-map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: '/world-map' })}
            className="flex-col h-auto py-2 px-4 gap-1"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs">World</span>
          </Button>
          <Button
            variant={currentPath === '/at-map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: '/at-map' })}
            className="flex-col h-auto py-2 px-4 gap-1"
          >
            <Mountain className="h-5 w-5" />
            <span className="text-xs">AT</span>
          </Button>
        </div>
      </nav>

      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
    </div>
  );
}
