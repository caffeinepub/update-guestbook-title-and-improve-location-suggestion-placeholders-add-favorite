import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GuestbookEntry, Location, Time } from '../backend';

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<GuestbookEntry[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntriesWithLocation() {
  const { actor, isFetching } = useActor();

  return useQuery<GuestbookEntry[]>({
    queryKey: ['entries-with-location'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesWithLocation();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntriesWithFavoritePlace() {
  const { actor, isFetching } = useActor();

  return useQuery<GuestbookEntry[]>({
    queryKey: ['entries-with-favorite-place'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesWithFavoritePlace();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      trailName,
      comment,
      currentLocation,
      favoritePlace,
    }: {
      name: string;
      trailName: string;
      comment: string;
      currentLocation: Location | null;
      favoritePlace: Location | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.addEntry(
        name.trim() || null,
        trailName.trim() || null,
        comment,
        currentLocation,
        favoritePlace
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entries-with-location'] });
      queryClient.invalidateQueries({ queryKey: ['entries-with-favorite-place'] });
    },
  });
}

export function useUpdateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      timestamp,
      name,
      trailName,
      comment,
      currentLocation,
      favoritePlace,
    }: {
      timestamp: Time;
      name: string;
      trailName: string;
      comment: string;
      currentLocation: Location | null;
      favoritePlace: Location | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.updateEntry(
        timestamp,
        name.trim() || null,
        trailName.trim() || null,
        comment,
        currentLocation,
        favoritePlace
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entries-with-location'] });
      queryClient.invalidateQueries({ queryKey: ['entries-with-favorite-place'] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timestamp: Time) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteEntry(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entries-with-location'] });
      queryClient.invalidateQueries({ queryKey: ['entries-with-favorite-place'] });
    },
  });
}
