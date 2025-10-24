"use client"

import { ClassContext } from "@/context/management/classes/context"
import { useContext } from "react"

export const useClasses = () => {
  const context = useContext(ClassContext)
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider")
  }
  return context
}