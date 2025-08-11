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







export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold,
    })
    if (!fontsLoaded) return null

    return (
        <SafeAreaProvider>
            <Stack  screenOptions={{ headerShown: false ,animation:"none"}} />
        </SafeAreaProvider>
    );
}


