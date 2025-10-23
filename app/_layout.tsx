// app/_layout.tsx

import { Text } from "react-native";

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import {
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { StudentAppDataProvider } from "@/context/Student/provider";
import UserTypeProvider from "@/context/RoleAuth/proider";
import AlertProvider from "@/context/Alert/provider";
import { useEffect } from "react";


export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold,
    })
    if (!fontsLoaded) return null




    return (
        <SafeAreaProvider>
            <UserTypeProvider>
                <AlertProvider>
                    <StudentAppDataProvider>
                        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
                    </StudentAppDataProvider>
                </AlertProvider>
            </UserTypeProvider>
        </SafeAreaProvider>
    );
}


