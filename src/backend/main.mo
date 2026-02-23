import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";

actor {
  // Mixins
  include MixinStorage();

  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Application Types
  type Service = {
    id : Text;
    name : Text;
    duration : Nat;
    price : Nat;
  };

  type Reservation = {
    id : Text;
    userId : Principal;
    cribId : Text;
    serviceId : Text;
    startTime : Time.Time;
  };

  type ReservedTimeSlot = {
    startTime : Time.Time;
    endTime : Time.Time;
  };

  type BabyCrib = {
    id : Text;
    name : Text;
    numberOfCaregivers : Nat;
    reservedTimeSlots : List.List<ReservedTimeSlot>;
  };

  public type BabyCribView = {
    id : Text;
    name : Text;
    numberOfCaregivers : Nat;
    reservedTimeSlots : [ReservedTimeSlot];
  };

  module BabyCrib {
    public func addReservation(crib : BabyCrib, startTime : Time.Time, endTime : Time.Time) : BabyCrib {
      let newReservedSlot : ReservedTimeSlot = { startTime; endTime };
      let reservedTimeSlots = crib.reservedTimeSlots.clone();
      reservedTimeSlots.add(newReservedSlot);
      {
        id = crib.id;
        name = crib.name;
        numberOfCaregivers = crib.numberOfCaregivers;
        reservedTimeSlots;
      };
    };

    public func isAvailable(crib : BabyCrib, startTime : Time.Time, endTime : Time.Time) : Bool {
      let overlaps = crib.reservedTimeSlots.values().find(
        func(slot) {
          (startTime < slot.endTime) and (endTime > slot.startTime);
        }
      );
      overlaps.isNull();
    };

    public func toView(crib : BabyCrib) : BabyCribView {
      {
        id = crib.id;
        name = crib.name;
        numberOfCaregivers = crib.numberOfCaregivers;
        reservedTimeSlots = crib.reservedTimeSlots.toArray();
      };
    };
  };

  type LoyaltyPoints = {
    points : Nat;
  };

  let services = Map.empty<Text, Service>();
  let reservations = Map.empty<Text, Reservation>();
  let babyCribs = Map.empty<Text, BabyCrib>();
  let loyaltyPoints = Map.empty<Principal, LoyaltyPoints>();

  // Stripe configuration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  /// Checks if Stripe is configured.
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  /// Sets Stripe configuration (admin only)
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

  /// Creates Stripe checkout session.
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  /// Transform query (used internally).
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Initialize baby cribs (Admin only)
  public shared ({ caller }) func initializeCribs() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize cribs");
    };

    let crib1 : BabyCrib = {
      id = "crib1";
      name = "Crib 1";
      numberOfCaregivers = 2;
      reservedTimeSlots = List.empty<ReservedTimeSlot>();
    };
    let crib2 : BabyCrib = {
      id = "crib2";
      name = "Crib 2";
      numberOfCaregivers = 1;
      reservedTimeSlots = List.empty<ReservedTimeSlot>();
    };
    let crib3 : BabyCrib = {
      id = "crib3";
      name = "Crib 3";
      numberOfCaregivers = 3;
      reservedTimeSlots = List.empty<ReservedTimeSlot>();
    };
    babyCribs.add(crib1.id, crib1);
    babyCribs.add(crib2.id, crib2);
    babyCribs.add(crib3.id, crib3);
  };

  // Crib management (Public read access)
  public query ({ caller }) func getAllCribs() : async [BabyCribView] {
    babyCribs.values().toArray().map(func(c) { BabyCrib.toView(c) });
  };

  public query ({ caller }) func getCrib(cribId : Text) : async BabyCribView {
    switch (babyCribs.get(cribId)) {
      case (null) { Runtime.trap("Crib not found") };
      case (?crib) { BabyCrib.toView(crib) };
    };
  };

  // Service management (Admin only)
  public shared ({ caller }) func addService(id : Text, name : Text, duration : Nat, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };

    if (services.containsKey(id)) {
      Runtime.trap("Service already exists");
    };
    services.add(
      id,
      { id; name; duration; price },
    );
  };

  // Reservation logic (User only)
  public shared ({ caller }) func reserveCrib(userId : Principal, cribId : Text, serviceId : Text, startTime : Time.Time) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can make reservations");
    };

    // Users can only make reservations for themselves
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only make reservations for yourself");
    };

    let service = switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };

    let endTime = startTime + (service.duration * 60_000_000_000);

    let crib = switch (babyCribs.get(cribId)) {
      case (null) { Runtime.trap("Crib not found") };
      case (?crib) { crib };
    };

    if (not BabyCrib.isAvailable(crib, startTime, endTime)) {
      Runtime.trap("Crib is not available for the requested time slot");
    };

    let reservationId = "res-" # userId.toText() # "-" # Time.now().toText();
    let reservation : Reservation = {
      id = reservationId;
      userId;
      cribId;
      serviceId;
      startTime;
    };

    let updatedCrib = BabyCrib.addReservation(crib, startTime, endTime);
    babyCribs.add(cribId, updatedCrib);

    reservations.add(reservationId, reservation);

    let currentPoints = switch (loyaltyPoints.get(userId)) {
      case (null) { 0 };
      case (?existing) { existing.points };
    };
    loyaltyPoints.add(userId, { points = currentPoints + 10 });

    reservationId;
  };

  public query ({ caller }) func getUserReservations(userId : Principal) : async [Reservation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reservations");
    };

    // Users can only view their own reservations, admins can view any
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reservations");
    };

    reservations.values().toArray().filter(
      func(res) { res.userId == userId }
    );
  };

  public query ({ caller }) func getAllReservations() : async [Reservation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all reservations");
    };

    reservations.values().toArray();
  };

  public shared ({ caller }) func cancelReservation(userId : Principal, reservationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel reservations");
    };

    let reservation = switch (reservations.get(reservationId)) {
      case (null) { Runtime.trap("Reservation not found") };
      case (?reservation) { reservation };
    };

    // Users can only cancel their own reservations, admins can cancel any
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only cancel your own reservations");
    };

    if (reservation.userId != userId) {
      Runtime.trap("Reservation does not belong to the specified user");
    };

    let crib = switch (babyCribs.get(reservation.cribId)) {
      case (null) { Runtime.trap("Crib not found") };
      case (?crib) { crib };
    };

    let updatedCrib = { crib with reservedTimeSlots = List.empty<ReservedTimeSlot>() };
    babyCribs.add(reservation.cribId, updatedCrib);

    reservations.remove(reservationId);
  };

  public query ({ caller }) func getLoyaltyPoints(userId : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loyalty points");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own loyalty points");
    };

    switch (loyaltyPoints.get(userId)) {
      case (null) { 0 };
      case (?existing) { existing.points };
    };
  };

  public shared ({ caller }) func spendLoyaltyPoints(userId : Principal, pointsToSpend : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can spend loyalty points");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only spend your own loyalty points");
    };

    let currentPoints = switch (loyaltyPoints.get(userId)) {
      case (null) { 0 };
      case (?existing) { existing.points };
    };

    if (currentPoints < pointsToSpend) {
      Runtime.trap("Insufficient loyalty points");
    };

    loyaltyPoints.add(userId, { points = currentPoints - pointsToSpend });
  };

  // Administrative functions (Admin only)
  public shared ({ caller }) func addCrib(id : Text, name : Text, caregivers : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add cribs");
    };

    if (babyCribs.containsKey(id)) {
      Runtime.trap("Crib already exists");
    };

    let crib : BabyCrib = {
      id;
      name;
      numberOfCaregivers = caregivers;
      reservedTimeSlots = List.empty<ReservedTimeSlot>();
    };
    babyCribs.add(id, crib);
  };

  public shared ({ caller }) func removeCrib(cribId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove cribs");
    };

    if (not babyCribs.containsKey(cribId)) {
      Runtime.trap("Crib not found");
    };
    babyCribs.remove(cribId);
  };

  // Initialization function to add default services (Admin only)
  public shared ({ caller }) func initializeServices() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize services");
    };

    let swaddling : Service = {
      id = "swaddling";
      name = "Swaddling";
      duration = 30;
      price = 100;
    };
    let massage : Service = {
      id = "massage";
      name = "Baby Massage";
      duration = 45;
      price = 150;
    };

    services.add("swaddling", swaddling);
    services.add("massage", massage);
  };

  public query ({ caller }) func getAvailableServices() : async [Service] {
    services.values().toArray();
  };
};
