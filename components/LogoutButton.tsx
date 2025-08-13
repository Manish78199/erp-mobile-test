"use client"

import type React from "react"
import { TouchableOpacity, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"

const LogoutButton: React.FC = () => {
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Add your logout logic here
          console.log("User logged out")
          // router.push("/login")
        },
      },
    ])
  }

  return (
    <TouchableOpacity
      onPress={handleLogout}
      className="bg-white/20 rounded-full p-2"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Icon name="logout" size={20} color="white" />
    </TouchableOpacity>
  )
}

export default LogoutButton
