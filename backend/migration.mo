import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  // Enums and types for the original actor state
  type ProfileStatus = {
    #draft;
    #published;
  };

  type WeeklyAvailability = {
    monday : [TimeSlot];
    tuesday : [TimeSlot];
    wednesday : [TimeSlot];
    thursday : [TimeSlot];
    friday : [TimeSlot];
    saturday : [TimeSlot];
    sunday : [TimeSlot];
  };

  type TimeSlot = {
    startTime : Nat;
    endTime : Nat;
  };

  // Original ProProfile record
  type ProProfile = {
    id : Principal;
    brandName : Text;
    slogan : Text;
    bio : Text;
    category : Text;
    city : Text;
    radius : Nat;
    languages : [Language];
    phone : Text;
    galleries : [Storage.ExternalBlob];
    mainPhoto : ?Storage.ExternalBlob;
    galleryPhotos : [Storage.ExternalBlob];
    weeklyAvailability : WeeklyAvailability;
    atHomeService : Bool;
    minBookingLeadTime : Nat;
    subscriptionStatus : Bool;
    trialStartDate : ?Time.Time;
    isVerified : Bool;
    profileStatus : ProfileStatus;
  };

  type Language = {
    language : Text;
    proficiency : Text;
  };

  type Booking = {
    id : Text;
    clientId : Principal;
    proId : Principal;
    serviceId : Text;
    date : Text;
    timeSlot : Text;
    address : Text;
    status : BookingStatus;
    totalPrice : Nat;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  // Original actor state type
  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text; appRole : ?{ #client; #professional } }>;
    proProfiles : Map.Map<Principal, ProProfile>;
    bookings : Map.Map<Text, Booking>;
    stripeConfig : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
  };

  // As there are no actual changes, we simply keep the old actor state
  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    // Only send the old state back, as there are no structural changes.
    old;
  };
};

