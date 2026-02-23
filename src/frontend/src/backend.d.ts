import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude: number;
    longitude: number;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface GuestbookEntry {
    creator: Principal;
    trailName?: string;
    name?: string;
    favoritePlace?: Location;
    comment: string;
    timestamp: Time;
    currentLocation?: Location;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEntry(name: string | null, trailName: string | null, comment: string, currentLocation: Location | null, favoritePlace: Location | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEntry(timestamp: Time): Promise<void>;
    getAllEntries(): Promise<Array<GuestbookEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEntriesWithFavoritePlace(): Promise<Array<GuestbookEntry>>;
    getEntriesWithLocation(): Promise<Array<GuestbookEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEntry(timestamp: Time, name: string | null, trailName: string | null, newComment: string, currentLocation: Location | null, favoritePlace: Location | null): Promise<void>;
}
