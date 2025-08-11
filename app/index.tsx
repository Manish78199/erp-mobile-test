import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useRouter} from "expo-router";

export default function App() {
    const router = useRouter();
    return (
        <View className="flex-1 bg-gradient-to-br from-blue-400 to-purple-500 justify-center items-center px-6">
            <Text className="text-4xl font-extrabold text-white mb-4">
                🎓 School ERP
            </Text>
            <Text className="text-lg text-white mb-8 text-center">
                Welcome to our playful School ERP! Manage academics, attendance, and communication with ease. Choose your portal to get started.
            </Text>
            <View className="flex-row space-x-4">
                <TouchableOpacity
                    className="bg-yellow-400 rounded-full px-6 py-3 shadow-lg active:bg-yellow-300"
                    onPress={() => {/* Navigate to management login */}}
                >
                    <Text className="text-lg font-bold text-white">Management Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-400 rounded-full px-6 py-3 shadow-lg active:bg-green-300"
                    onPress={() => {router.push('/login')}}
                >
                    <Text className="text-lg font-bold text-white">Student Login</Text>
                </TouchableOpacity>
            </View>
            <Text className="mt-10 text-white opacity-70 text-xs">
                Empowering schools, teachers, and students!
            </Text>
        </View>
    );
}