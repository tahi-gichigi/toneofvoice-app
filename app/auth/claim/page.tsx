"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

/**
 * Intercept page between auth completion and dashboard.
 * Saves any pending localStorage guide to the DB before the
 * dashboard server component renders, so the guide is visible
 * immediately instead of flashing "No style guides yet".
 */
export default function ClaimPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const attempted = useRef(false)

  useEffect(() => {
    // Wait for auth to settle
    if (authLoading) return
    // Guard against double-runs
    if (attempted.current) return
    attempted.current = true

    // No user somehow - send to sign-in
    if (!user) {
      router.replace("/sign-in")
      return
    }

    const brandDetails = localStorage.getItem("brandDetails")
    const previewContent = localStorage.getItem("previewContent")

    // Nothing to claim - go straight to dashboard
    if (!brandDetails || !previewContent) {
      router.replace("/dashboard")
      return
    }

    // Save the pending guide before navigating to dashboard
    const claimGuide = async () => {
      try {
        const parsed = JSON.parse(brandDetails)
        const res = await fetch("/api/save-style-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${parsed.name || "Brand"} Style Guide`,
            brand_name: parsed.name || "Brand",
            content_md: previewContent,
            plan_type: "style_guide",
            brand_details: parsed,
          }),
        })

        if (res.ok) {
          const data = await res.json().catch(() => null)
          if (data?.guide?.id) {
            // Clean up localStorage so AutoSaveGuide doesn't re-save
            localStorage.removeItem("previewContent")
            localStorage.setItem("savedGuideId", data.guide.id)
            console.log("[claim] Guide saved:", data.guide.id)
          }
        } else {
          console.warn("[claim] Save failed, falling back to AutoSaveGuide")
        }
      } catch (err) {
        console.error("[claim] Error saving guide:", err)
        // AutoSaveGuide on dashboard will retry
      }

      // Always redirect to dashboard regardless of outcome
      router.replace("/dashboard")
    }

    claimGuide()
  }, [user, authLoading, router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <p className="text-sm text-gray-500">Setting up your dashboard...</p>
      </div>
    </div>
  )
}
