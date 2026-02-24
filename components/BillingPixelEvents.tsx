"use client";

// Fires ViewContent when a user visits the billing/pricing page.
// This signals high purchase intent to Meta for ad optimisation.
import { useEffect } from "react";
import { MetaPixel } from "@/lib/meta-pixel";

export function BillingPixelEvents() {
  useEffect(() => {
    MetaPixel.viewContent("billing");
  }, []);

  return null;
}
