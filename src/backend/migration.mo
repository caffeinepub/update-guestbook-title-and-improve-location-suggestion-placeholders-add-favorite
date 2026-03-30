import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    entries : Map.Map<Text, {
      timestamp : Time.Time;
      creator : Principal;
      name : ?Text;
      trailName : ?Text;
      comment : Text;
      currentLocation : ?{
        latitude : Float;
        longitude : Float;
      };
      favoritePlace : ?{
        latitude : Float;
        longitude : Float;
      };
    }>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    entries : Map.Map<Text, {
      timestamp : Time.Time;
      creator : Principal;
      name : ?Text;
      trailName : ?Text;
      comment : Text;
      currentLocation : ?{
        latitude : Float;
        longitude : Float;
      };
      favoritePlace : ?{
        latitude : Float;
        longitude : Float;
      };
    }>;
  };

  // No changes to actor state
  public func run(old : OldActor) : NewActor {
    old;
  };
};
