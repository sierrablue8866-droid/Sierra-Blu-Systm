import { createRouteMatcher } from "@clerk/nextjs/server";

export const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/about(.*)",
  "/listings(.*)",
  "/projects(.*)",
  "/services(.*)",
  "/advisors(.*)",
  "/journal(.*)",
  "/contact(.*)",
]);
