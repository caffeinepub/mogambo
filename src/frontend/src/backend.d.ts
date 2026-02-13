import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface JobSource {
    id: bigint;
    url: string;
    fetchType: FetchType;
    name: string;
    enabled: boolean;
}
export interface JobListing {
    title: string;
    applyUrl: string;
    source: string;
    date: string;
    company: string;
    location: string;
}
export interface UserProfile {
    name: string;
}
export interface Filter {
    keywords: Array<string>;
    location: string;
}
export enum FetchType {
    rss = "rss",
    json = "json"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJobSource(name: string, url: string, fetchType: FetchType): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteJobSource(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEnabledJobSources(): Promise<Array<JobSource>>;
    getJobSources(): Promise<Array<JobSource>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchJobs(arg0: string, arg1: string, arg2: Filter | null): Promise<Array<JobListing>>;
    toggleJobSource(id: bigint, enabled: boolean): Promise<void>;
    updateJobSource(id: bigint, name: string, url: string, fetchType: FetchType): Promise<void>;
}
