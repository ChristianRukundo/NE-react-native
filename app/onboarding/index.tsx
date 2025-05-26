"use client"

import { useEffect } from "react"
import { router } from "expo-router"

export default function OnboardingIndex() {
  useEffect(() => {
    router.replace("/onboarding/step-1")
  }, [])

  return null
}
