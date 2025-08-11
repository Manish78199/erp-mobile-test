"use client"
import { TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

interface LogoutButtonProps {
  color?: string
  size?: number
}

export default function LogoutButton({ color = "white", size = 24 }: LogoutButtonProps) {
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
        onPress: async () => {
          try {
            // Clear access token from AsyncStorage
            await AsyncStorage.removeItem("access_token")

            // Redirect to home/login
            router.replace("/")
          } catch (error) {
            console.error("Error during logout:", error)
          }
        },
      },
    ])
  }

  return (
    <TouchableOpacity onPress={handleLogout} className="p-2">
      <Ionicons name="log-out-outline" size={size} color={color} />
    </TouchableOpacity>
  )
}
