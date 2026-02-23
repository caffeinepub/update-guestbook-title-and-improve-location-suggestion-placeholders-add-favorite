import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile System
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Guestbook Types
  type Location = {
    latitude : Float;
    longitude : Float;
  };

  type GuestbookEntry = {
    timestamp : Time.Time;
    creator : Principal;
    name : ?Text;
    trailName : ?Text;
    comment : Text;
    currentLocation : ?Location;
    favoritePlace : ?Location;
  };

  module GuestbookEntry {
    public func compare(a : GuestbookEntry, b : GuestbookEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let entries = Map.empty<Text, GuestbookEntry>();

  public shared ({ caller }) func addEntry(
    name : ?Text,
    trailName : ?Text,
    comment : Text,
    currentLocation : ?Location,
    favoritePlace : ?Location,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add guestbook entries");
    };

    if (Text.equal(comment.trim(#char ' '), "")) {
      Runtime.trap("Comment cannot be empty.");
    };

    let entry : GuestbookEntry = {
      timestamp = Time.now();
      creator = caller;
      name;
      trailName;
      comment;
      currentLocation;
      favoritePlace;
    };

    entries.add(comment, entry);
  };

  public shared ({ caller }) func updateEntry(
    timestamp : Time.Time,
    name : ?Text,
    trailName : ?Text,
    newComment : Text,
    currentLocation : ?Location,
    favoritePlace : ?Location,
  ) : async () {
    if (Text.equal(newComment.trim(#char ' '), "")) {
      Runtime.trap("Comment cannot be empty.");
    };

    // Find the entry by timestamp
    let entryResult = entries.entries().toArray().find(
      func((_, entry)) { entry.timestamp == timestamp }
    );

    switch (entryResult) {
      case (null) {
        Runtime.trap("Entry Not Found: No entry found with the timestamp " # timestamp.toText());
      };
      case (?(oldComment, existingEntry)) {
        // Authorization: Only the creator or an admin can update
        if (caller != existingEntry.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the entry creator or an admin can update this entry");
        };

        // Remove old entry
        ignore entries.remove(oldComment);

        // Add updated entry with new comment as key
        let updatedEntry : GuestbookEntry = {
          timestamp;
          creator = existingEntry.creator; // Preserve original creator
          name;
          trailName;
          comment = newComment;
          currentLocation;
          favoritePlace;
        };
        entries.add(newComment, updatedEntry);
      };
    };
  };

  public shared ({ caller }) func deleteEntry(timestamp : Time.Time) : async () {
    // Find the entry by timestamp
    let entryResult = entries.entries().toArray().find(
      func((_, entry)) { entry.timestamp == timestamp }
    );

    switch (entryResult) {
      case (null) {
        Runtime.trap("Entry Not Found: No entry found with the timestamp " # timestamp.toText());
      };
      case (?(comment, existingEntry)) {
        // Authorization: Only the creator or an admin can delete
        if (caller != existingEntry.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the entry creator or an admin can delete this entry");
        };

        ignore entries.remove(comment);
      };
    };
  };

  public query ({ caller }) func getAllEntries() : async [GuestbookEntry] {
    entries.values().toArray().sort();
  };

  public query ({ caller }) func getEntriesWithLocation() : async [GuestbookEntry] {
    entries.values().toArray().filter<GuestbookEntry>(
      func(entry) { entry.currentLocation != null }
    );
  };

  public query ({ caller }) func getEntriesWithFavoritePlace() : async [GuestbookEntry] {
    entries.values().toArray().filter<GuestbookEntry>(
      func(entry) { entry.favoritePlace != null }
    );
  };
};
