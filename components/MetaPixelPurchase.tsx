"use client";

// Fires Meta Pixel conversion events on the dashboard after specific actions:
// 1. Stripe redirect: ?subscription=success&plan=pro|agency → Purchase + Subscribe
// 2. Google OAuth sign-up: localStorage flag set on sign-up page → CompleteRegistration
//    (guarded by created_at check to avoid firing for returning OAuth users)
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MetaPixel } from "@/lib/meta-pixel";
import { createClient } from "@/lib/supabase-browser";

export function MetaPixelPurchase() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle Stripe success redirect
  useEffect(() => {
    const subscription = searchParams.get("subscription");
    const plan = searchParams.get("plan") as "pro" | "agency" | null;

    if (subscription === "success" && (plan === "pro" || plan === "agency")) {
      MetaPixel.purchase(plan);
      // Remove params from URL so a refresh doesn't re-fire the event
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, router]);

  // Handle Google OAuth sign-up: check for flag set on the sign-up page
  useEffect(() => {
    const pending = localStorage.getItem("meta_pixel_pending");
    if (pending !== "complete_registration") return;

    // Clear immediately to prevent double-fire if dashboard mounts twice
    localStorage.removeItem("meta_pixel_pending");

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const createdAt = data.user?.created_at;
      if (!createdAt) return;
      // Only fire for accounts created in the last 10 minutes - guards against
      // returning users who hit /sign-up and clicked "Continue with Google"
      const ageMs = Date.now() - new Date(createdAt).getTime();
      if (ageMs < 10 * 60 * 1000) {
        MetaPixel.completeRegistration();
      }
    });
  }, []); // run once on mount

  return null;
}
