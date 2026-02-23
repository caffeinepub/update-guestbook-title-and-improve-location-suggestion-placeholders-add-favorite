import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppLayout from './components/AppLayout';
import GuestbookFeedPage from './pages/GuestbookFeedPage';
import AddEntryPage from './pages/AddEntryPage';
import EntryDetailPage from './pages/EntryDetailPage';
import WorldMapPage from './pages/WorldMapPage';
import ATMapPage from './pages/ATMapPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GuestbookFeedPage,
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add',
  component: AddEntryPage,
});

const entryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry/$entryId',
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
  indexRoute,
  addRoute,
  entryRoute,
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
  return <RouterProvider router={router} />;
}
