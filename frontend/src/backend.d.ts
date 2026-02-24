import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProProfile {
    id: Principal;
    bio: string;
    atHomeService: boolean;
    city: string;
    languages: Array<Language>;
    weeklyAvailability: WeeklyAvailability;
    slogan: string;
    subscriptionStatus: boolean;
    isVerified: boolean;
    profileStatus: ProfileStatus;
    category: string;
    radius: bigint;
    galleries: Array<ExternalBlob>;
    brandName: string;
    phone: string;
    trialStartDate?: Time;
    mainPhoto?: ExternalBlob;
    galleryPhotos: Array<ExternalBlob>;
    minBookingLeadTime: bigint;
}
export interface TimeSlot {
    startTime: bigint;
    endTime: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Service {
    id: string;
    duration: bigint;
    name: string;
    badges: Array<string>;
    beforeAfterPhotos: Array<ExternalBlob>;
    price: bigint;
}
export interface Language {
    language: string;
    proficiency: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface WeeklyAvailability {
    tuesday: Array<TimeSlot>;
    wednesday: Array<TimeSlot>;
    saturday: Array<TimeSlot>;
    thursday: Array<TimeSlot>;
    sunday: Array<TimeSlot>;
    friday: Array<TimeSlot>;
    monday: Array<TimeSlot>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Booking {
    id: string;
    status: BookingStatus;
    clientId: Principal;
    date: string;
    address: string;
    serviceId: string;
    proId: Principal;
    totalPrice: bigint;
    timeSlot: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    appRole?: AppUserRole;
    name: string;
}
export enum AppUserRole {
    client = "client",
    professional = "professional"
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum ProfileStatus {
    published = "published",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBookingRequest(proId: Principal, serviceId: string, date: string, timeSlot: string, address: string): Promise<string>;
    /**
     * / Creates Stripe checkout session (authenticated users only).
     */
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrUpdateProProfile(profile: ProProfile): Promise<void>;
    filterProsByLocation(centerLat: number, centerLong: number, radius: bigint, category: string | null): Promise<Array<ProProfile>>;
    /**
     * / Returns a single booking. Only the client, the assigned professional, or an admin may view it.
     */
    getBooking(bookingId: string): Promise<Booking | null>;
    /**
     * / Returns bookings for a given professional. Caller must be that professional or an admin.
     */
    getBookingsByProfessional(proId: Principal): Promise<Array<Booking>>;
    /**
     * / Returns bookings for a given user. Caller must be the user themselves or an admin.
     */
    getBookingsByUser(userId: Principal, _status: BookingStatus | null): Promise<Array<Booking>>;
    /**
     * / Returns the caller's own user profile.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Returns a pro profile. Published profiles are publicly visible; draft profiles
     * / are only visible to the owner or an admin.
     */
    getProProfile(proId: Principal): Promise<ProProfile>;
    /**
     * / Gets Stripe session status.
     */
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    /**
     * / Fetches another user's profile. Caller can view their own; admins can view any.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Checks if Stripe is configured.
     */
    isStripeConfigured(): Promise<boolean>;
    publishProfile(): Promise<void>;
    /**
     * / Saves the caller's own user profile.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Sets Stripe configuration (admin only).
     */
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    /**
     * / Transform query (used internally).
     */
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void>;
    updateGallery(mainPhoto: ExternalBlob | null, galleryPhotos: Array<ExternalBlob>): Promise<void>;
    updateServices(_services: Array<Service>): Promise<void>;
    updateWeeklyAvailability(availability: WeeklyAvailability): Promise<void>;
}
