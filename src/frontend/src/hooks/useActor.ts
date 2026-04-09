import { useActor as useActorLib } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { GuestbookActor } from "../types/guestbook";

export function useActor() {
  const result = useActorLib(createActor);
  return {
    actor: result.actor as unknown as GuestbookActor | null,
    isFetching: result.isFetching,
  };
}
