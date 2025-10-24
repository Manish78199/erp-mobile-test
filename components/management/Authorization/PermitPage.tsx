"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { UserAuthorization } from "@/context/Access/context"
import { Typography } from "@/components/Typography"

export function PermitPage({
  module,
  action,
  children,
}: {
  module: string
  action: string
  children: React.ReactNode
}) {
  const { Permission, Role } = useContext(UserAuthorization)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (Role && Role === "SUPERADMIN") {
      setAuthorized(true)
    } else if (Permission && Permission[module] && Permission[module].includes(action)) {
      setAuthorized(true)
    }
  }, [Permission, Role])

  if (!authorized) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F0F4F8]">
        <Typography className="text-lg font-bold text-[#2C3E50]">Access Denied</Typography>
        <Typography className="text-sm text-[#7F8C8D] mt-2">You don't have permission to access this module</Typography>
      </View>
    )
  }

  return <View className="flex-1">{children}</View>
}
