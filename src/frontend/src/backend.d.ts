import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BabyCribView {
    id: string;
    numberOfCaregivers: bigint;
    name: string;
    reservedTimeSlots: Array<ReservedTimeSlot>;
}
export type Time = bigint;
export interface ReservedTimeSlot {
    startTime: Time;
    endTime: Time;
}
export interface Service {
    id: string;
    duration: bigint;
    name: string;
    price: bigint;
}
export interface Reservation {
    id: string;
    startTime: Time;
    userId: Principal;
    cribId: string;
    serviceId: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCrib(id: string, name: string, caregivers: bigint): Promise<void>;
    addService(id: string, name: string, duration: bigint, price: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelReservation(userId: Principal, reservationId: string): Promise<void>;
    getAllCribs(): Promise<Array<BabyCribView>>;
    getAllReservations(): Promise<Array<Reservation>>;
    getAvailableServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCrib(cribId: string): Promise<BabyCribView>;
    getLoyaltyPoints(userId: Principal): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserReservations(userId: Principal): Promise<Array<Reservation>>;
    initializeCribs(): Promise<void>;
    initializeServices(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeCrib(cribId: string): Promise<void>;
    reserveCrib(userId: Principal, cribId: string, serviceId: string, startTime: Time): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    spendLoyaltyPoints(userId: Principal, pointsToSpend: bigint): Promise<void>;
}
