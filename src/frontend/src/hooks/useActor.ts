import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { getSecretParameter } from "../utils/urlParams";
import { useInternetIdentity } from "./useInternetIdentity";

const ACTOR_QUERY_KEY = "actor";

export function useActor() {
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  // Use a stable string key: anonymous principal or the real principal
  const identityKey = isInitializing
    ? "__initializing__"
    : (identity?.getPrincipal().toString() ?? "anonymous");

  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identityKey],
    queryFn: async () => {
      // Always create at minimum an anonymous actor
      if (!identity || identity.getPrincipal().isAnonymous()) {
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: { identity },
      };
      const actor = await createActorWithConfig(actorOptions);
      const adminToken = getSecretParameter("caffeineAdminToken") || "";
      await actor._initializeAccessControlWithSecret(adminToken);
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: 3,
    retryDelay: 1000,
    // Don't run while identity provider is still initializing
    enabled: !isInitializing,
  });

  // When the actor changes, invalidate dependent queries
  const prevActorRef = useRef<backendInterface | null>(null);
  useEffect(() => {
    if (actorQuery.data && actorQuery.data !== prevActorRef.current) {
      prevActorRef.current = actorQuery.data;
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
      queryClient.refetchQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data ?? null,
    isFetching: isInitializing || actorQuery.isFetching,
    isError: actorQuery.isError,
  };
}
