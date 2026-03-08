import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";
import AppLayout from "./components/AppLayout";
import ATMapPage from "./pages/ATMapPage";
import AddEntryPage from "./pages/AddEntryPage";
import EntryDetailPage from "./pages/EntryDetailPage";
import GuestbookFeedPage from "./pages/GuestbookFeedPage";
import WorldMapPage from "./pages/WorldMapPage";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GuestbookFeedPage,
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add",
  component: AddEntryPage,
});

const entryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/entry/$timestamp",
  component: EntryDetailPage,
});

const worldMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/world-map",
  component: WorldMapPage,
});

const atMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/at-map",
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

// Expose router globally so Leaflet popup links can navigate via TanStack Router
(window as any).__vthRouter = router;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
