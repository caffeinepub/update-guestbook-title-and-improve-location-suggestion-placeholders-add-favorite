import type { Principal } from "@icp-sdk/core/principal";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface GuestbookEntry {
  timestamp: bigint;
  name: string | null;
  trailName: string | null;
  comment: string;
  creator: Principal;
  currentLocation: Location | null;
  favoritePlace: Location | null;
}

export interface UserProfile {
  displayName: string | null;
}

/** Typed actor interface matching the backend canister methods */
export interface GuestbookActor {
  getAllEntries(): Promise<GuestbookEntry[]>;
  getEntriesWithLocation(): Promise<GuestbookEntry[]>;
  getEntriesWithFavoritePlace(): Promise<GuestbookEntry[]>;
  getCallerUserProfile(): Promise<UserProfile | null>;
  isCallerAdmin(): Promise<boolean>;
  addEntry(
    name: string | null,
    trailName: string | null,
    comment: string,
    currentLocation: Location | null,
    favoritePlace: Location | null,
  ): Promise<void>;
  updateEntry(
    timestamp: bigint,
    name: string | null,
    trailName: string | null,
    newComment: string,
    currentLocation: Location | null,
    favoritePlace: Location | null,
  ): Promise<void>;
  deleteEntry(timestamp: bigint): Promise<void>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
