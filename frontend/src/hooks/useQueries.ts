import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GuestbookEntry, Location, UserProfile } from '../backend';

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<GuestbookEntry[]>({
    queryKey: ['getAllEntries'],
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
    queryKey: ['getEntriesWithLocation'],
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
    queryKey: ['getEntriesWithFavoritePlace'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesWithFavoritePlace();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
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
      name: string | null;
      trailName: string | null;
      comment: string;
      currentLocation: Location | null;
      favoritePlace: Location | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addEntry(name, trailName, comment, currentLocation, favoritePlace);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllEntries'] });
      queryClient.invalidateQueries({ queryKey: ['getEntriesWithLocation'] });
      queryClient.invalidateQueries({ queryKey: ['getEntriesWithFavoritePlace'] });
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
      newComment,
      currentLocation,
      favoritePlace,
    }: {
      timestamp: bigint;
      name: string | null;
      trailName: string | null;
      newComment: string;
      currentLocation: Location | null;
      favoritePlace: Location | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateEntry(timestamp, name, trailName, newComment, currentLocation, favoritePlace);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllEntries'] });
      queryClient.invalidateQueries({ queryKey: ['getEntriesWithLocation'] });
      queryClient.invalidateQueries({ queryKey: ['getEntriesWithFavoritePlace'] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteEntry(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllEntries'] });
      queryClient.invalidateQueries({ queryKey: ['getEntriesWithLocation'] });
      queryClient.invalidateQueries({ queryKey: ['getEntriesWithFavoritePlace'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
