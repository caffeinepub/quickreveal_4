import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Mixins
  include MixinStorage();

  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Enums
  public type AppUserRole = {
    #client;
    #professional;
  };

  public type ProfileStatus = {
    #draft;
    #published;
  };

  public type TrialStatus = {
    #notStarted;
    #active : Nat; // days remaining
    #expired;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  // User profile type required by the frontend
  public type UserProfile = {
    name : Text;
    appRole : ?AppUserRole;
  };

  // Types
  public type Language = {
    language : Text;
    proficiency : Text;
  };

  public type Service = {
    id : Text;
    name : Text;
    duration : Nat;
    price : Nat;
    beforeAfterPhotos : [Storage.ExternalBlob];
    badges : [Text];
  };

  public type TimeSlot = {
    startTime : Nat;
    endTime : Nat;
  };

  public type WeeklyAvailability = {
    monday : [TimeSlot];
    tuesday : [TimeSlot];
    wednesday : [TimeSlot];
    thursday : [TimeSlot];
    friday : [TimeSlot];
    saturday : [TimeSlot];
    sunday : [TimeSlot];
  };

  public type ProProfile = {
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

  public type Booking = {
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

  // Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let proProfiles = Map.empty<Principal, ProProfile>();
  let bookings = Map.empty<Text, Booking>();

  // Stripe configuration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // -----------------------------------------------------------------------
  // User Profile Management (required by frontend)
  // -----------------------------------------------------------------------

  /// Returns the caller's own user profile.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  /// Saves the caller's own user profile.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  /// Fetches another user's profile. Caller can view their own; admins can view any.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // -----------------------------------------------------------------------
  // Helper: app-level role checks
  // -----------------------------------------------------------------------

  /// Returns the app-level role of the caller from their stored user profile.
  private func getCallerAppRole(caller : Principal) : ?AppUserRole {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile.appRole };
    };
  };

  /// Asserts the caller is an authenticated user with the #professional app role.
  private func requireProfessional(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    switch (getCallerAppRole(caller)) {
      case (?#professional) {};
      case (_) {
        Runtime.trap("Unauthorized: Only professionals can perform this action");
      };
    };
  };

  /// Asserts the caller is an authenticated user with the #client app role.
  private func requireClient(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    switch (getCallerAppRole(caller)) {
      case (?#client) {};
      case (_) {
        Runtime.trap("Unauthorized: Only clients can perform this action");
      };
    };
  };

  // -----------------------------------------------------------------------
  // Stripe
  // -----------------------------------------------------------------------

  /// Checks if Stripe is configured.
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  /// Sets Stripe configuration (admin only).
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  /// Retrieves current configuration (private).
  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  /// Gets Stripe session status.
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  /// Creates Stripe checkout session (authenticated users only).
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to create a checkout session");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  /// Transform query (used internally).
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // -----------------------------------------------------------------------
  // Pro Profile Management
  // -----------------------------------------------------------------------

  public shared ({ caller }) func createOrUpdateProProfile(profile : ProProfile) : async () {
    requireProfessional(caller);

    if (profile.radius < 1 or profile.radius > 50) {
      Runtime.trap("Invalid radius value. Must be between 1 and 50 km");
    };

    validateBioLength(profile.bio);

    proProfiles.add(caller, {
      profile with
      id = caller;
      isVerified = false;
      profileStatus = #draft;
      trialStartDate = calculateTrialStatus(profile.trialStartDate);
    });
  };

  private func calculateTrialStatus(existingTrial : ?Time.Time) : ?Time.Time {
    let currentTime = Time.now();
    switch (existingTrial) {
      case (null) { ?currentTime };
      case (?startTime) {
        let daysSinceStart = (currentTime - startTime) / (86_400_000_000_000 : Int);
        if (daysSinceStart >= 7) { null } else { ?startTime };
      };
    };
  };

  private func validateBioLength(bio : Text) {
    let bioLength = bio.toArray().size();
    if (bioLength == 0) {
      Runtime.trap("Bio cannot be empty");
    } else if (bioLength > 500) {
      Runtime.trap("Bio cannot exceed 500 characters");
    };
  };

  /// Returns a pro profile. Published profiles are publicly visible; draft profiles
  /// are only visible to the owner or an admin.
  public query ({ caller }) func getProProfile(proId : Principal) : async ProProfile {
    switch (proProfiles.get(proId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        // Draft profiles are private: only the owner or an admin may view them
        if (profile.profileStatus == #draft) {
          if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: This profile is not yet published");
          };
        };
        profile;
      };
    };
  };

  public shared ({ caller }) func publishProfile() : async () {
    requireProfessional(caller);

    let profile = switch (proProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    if (profile.trialStartDate == null) {
      Runtime.trap("Trial period not started");
    };

    let newProfile = { profile with isVerified = true; profileStatus = #published };
    proProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func updateServices(_services : [Service]) : async () {
    requireProfessional(caller);

    let profile = switch (proProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    proProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateWeeklyAvailability(availability : WeeklyAvailability) : async () {
    requireProfessional(caller);

    let profile = switch (proProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    let newProfile = { profile with weeklyAvailability = availability };
    proProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func updateGallery(mainPhoto : ?Storage.ExternalBlob, galleryPhotos : [Storage.ExternalBlob]) : async () {
    requireProfessional(caller);

    let profile = switch (proProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    if (galleryPhotos.size() < 3) {
      Runtime.trap("At least 3 gallery photos required");
    };

    let newProfile = { profile with mainPhoto; galleryPhotos };
    proProfiles.add(caller, newProfile);
  };

  // -----------------------------------------------------------------------
  // Explorer Filtering (public — no auth required)
  // -----------------------------------------------------------------------

  public query func filterProsByLocation(centerLat : Float, centerLong : Float, radius : Nat, category : ?Text) : async [ProProfile] {
    proProfiles.values().toArray().filter(
      func(profile) {
        // Only return published profiles in the explorer
        if (profile.profileStatus != #published) { return false };
        let withinDistance = calculateDistance(centerLat, centerLong, 0.0, 0.0) <= radius;
        let matchesCategory = switch (category) {
          case (null) { true };
          case (?cat) { profile.category == cat };
        };
        withinDistance and matchesCategory;
      }
    );
  };

  func calculateDistance(_lat1 : Float, _long1 : Float, _lat2 : Float, _long2 : Float) : Nat {
    10; // Dummy value for testing
  };

  // -----------------------------------------------------------------------
  // Booking Management
  // -----------------------------------------------------------------------

  public shared ({ caller }) func createBookingRequest(proId : Principal, serviceId : Text, date : Text, timeSlot : Text, address : Text) : async Text {
    requireClient(caller);

    let proProfile = switch (proProfiles.get(proId)) {
      case (null) { Runtime.trap("Professional not found") };
      case (?pro) { pro };
    };

    if (calculateTrialStatus(proProfile.trialStartDate) == null) {
      Runtime.trap("Professional's trial period has expired");
    };

    // Placeholder service lookup — real implementation would query a services map
    let service : Service = { id = serviceId; name = "Service"; duration = 30; price = 100; beforeAfterPhotos = []; badges = [] };

    let totalPrice = service.price;
    let bookingId = "booking-" # caller.toText() # "-" # Int.toText(Time.now());

    let booking : Booking = {
      id = bookingId;
      clientId = caller;
      proId;
      serviceId;
      date;
      timeSlot;
      address;
      status = #pending;
      totalPrice;
    };

    bookings.add(bookingId, booking);
    bookingId;
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Text, status : BookingStatus) : async () {
    requireProfessional(caller);

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };

    // Only the professional assigned to this booking may update its status
    if (booking.proId != caller) {
      Runtime.trap("Unauthorized: Only the assigned professional can update this booking");
    };

    let newBooking = { booking with status };
    bookings.add(bookingId, newBooking);
  };

  /// Returns bookings for a given user. Caller must be the user themselves or an admin.
  public query ({ caller }) func getBookingsByUser(userId : Principal, _status : ?BookingStatus) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to view bookings");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };

    bookings.values().toArray().filter(
      func(booking) {
        booking.clientId == userId;
      }
    );
  };

  /// Returns bookings for a given professional. Caller must be that professional or an admin.
  public query ({ caller }) func getBookingsByProfessional(proId : Principal) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to view bookings");
    };

    if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };

    bookings.values().toArray().filter(
      func(booking) {
        booking.proId == proId;
      }
    );
  };

  /// Returns a single booking. Only the client, the assigned professional, or an admin may view it.
  public query ({ caller }) func getBooking(bookingId : Text) : async ?Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to view a booking");
    };

    switch (bookings.get(bookingId)) {
      case (null) { null };
      case (?booking) {
        if (
          caller != booking.clientId and
          caller != booking.proId and
          not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: You do not have access to this booking");
        };
        ?booking;
      };
    };
  };
};

