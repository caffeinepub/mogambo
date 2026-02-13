import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type JobSource = {
    id : Nat;
    name : Text;
    url : Text;
    fetchType : FetchType;
    enabled : Bool;
  };

  public type FetchType = {
    #json;
    #rss;
  };

  public type JobListing = {
    title : Text;
    company : Text;
    location : Text;
    source : Text;
    date : Text;
    applyUrl : Text;
  };

  public type Filter = {
    location : Text;
    keywords : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  let jobSources = Map.empty<Nat, JobSource>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Job Sources Management
  public shared ({ caller }) func addJobSource(name : Text, url : Text, fetchType : FetchType) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add sources");
    };

    let newId = jobSources.size();
    let source = {
      id = newId;
      name;
      url;
      fetchType;
      enabled = true;
    };

    jobSources.add(newId, source);
    newId;
  };

  public shared ({ caller }) func updateJobSource(id : Nat, name : Text, url : Text, fetchType : FetchType) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update sources");
    };

    switch (jobSources.get(id)) {
      case (null) { Runtime.trap("Source not found") };
      case (?_) {
        let updatedSource = {
          id;
          name;
          url;
          fetchType;
          enabled = true;
        };
        jobSources.add(id, updatedSource);
      };
    };
  };

  public shared ({ caller }) func toggleJobSource(id : Nat, enabled : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can toggle sources");
    };

    switch (jobSources.get(id)) {
      case (null) { Runtime.trap("Source not found") };
      case (?source) {
        let updatedSource = {
          id = source.id;
          name = source.name;
          url = source.url;
          fetchType = source.fetchType;
          enabled;
        };
        jobSources.add(id, updatedSource);
      };
    };
  };

  public shared ({ caller }) func deleteJobSource(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete sources");
    };

    switch (jobSources.get(id)) {
      case (null) { Runtime.trap("Source not found") };
      case (?_) {
        jobSources.remove(id);
      };
    };
  };

  public query ({ caller }) func getJobSources() : async [JobSource] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all sources");
    };
    jobSources.values().toArray();
  };

  public query ({ caller }) func getEnabledJobSources() : async [JobSource] {
    // Public access - anyone including guests can view enabled sources
    jobSources.values().toArray().filter(func(source) { source.enabled });
  };

  public query ({ caller }) func searchJobs(_ : Text, _ : Text, _ : ?Filter) : async [JobListing] {
    // Public access - anyone including guests can search jobs
    [] : [JobListing];
  };
};
