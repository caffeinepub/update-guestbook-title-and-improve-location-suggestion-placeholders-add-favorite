import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import GuestbookFeedPage from './pages/GuestbookFeedPage';
import AddEntryPage from './pages/AddEntryPage';
import EntryDetailPage from './pages/EntryDetailPage';
import WorldMapPage from './pages/WorldMapPage';
import ATMapPage from './pages/ATMapPage';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: AppLayout,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GuestbookFeedPage,
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add',
  component: AddEntryPage,
});

const entryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry/$timestamp',
  component: EntryDetailPage,
});

const worldMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/world-map',
  component: WorldMapPage,
});

const atMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/at-map',
  component: ATMapPage,
});

const routeTree = rootRoute.addChildren([
  feedRoute,
  addRoute,
  entryDetailRoute,
  worldMapRoute,
  atMapRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
