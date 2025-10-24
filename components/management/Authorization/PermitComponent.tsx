"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { UserAuthorization } from "@/context/Access/context"

export function PermitComponent({
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
      console.log(Permission, Permission[module], Permission[module].includes(action), action)
      setAuthorized(true)
    }
  }, [Permission, Role])

  return <View>{authorized && <View>{children}</View>}</View>
}
