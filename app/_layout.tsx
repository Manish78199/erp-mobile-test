// app/_layout.tsx


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
            <StudentAppDataProvider>
                <Stack screenOptions={{ headerShown: false, animation: "none" }} />
            </StudentAppDataProvider>
            </UserTypeProvider>
        </SafeAreaProvider>
    );
}


