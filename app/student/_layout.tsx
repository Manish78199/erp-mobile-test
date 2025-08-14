import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { View } from "react-native"

const TabIcon = ({
  name,
  color,
  focused,
  activeColor,
  inactiveColor,
}: {
  name: keyof typeof Ionicons.glyphMap
  color: string
  focused: boolean
  activeColor: string
  inactiveColor: string
}) => {
  return (
    <View className={`items-center justify-center ${focused ? "transform scale-110" : ""}`}>
      {/* {focused && (
        <View className="absolute w-12 h-8 rounded-2xl opacity-20" style={{ backgroundColor: activeColor }} />
      )} */}
      <Ionicons
        name={focused ? (name.replace("-outline", "") as keyof typeof Ionicons.glyphMap) : name}
        size={24}
        color={focused ? activeColor : inactiveColor}
      />
    </View>
  )
}

export default function StudentLayout() {
  const activeColor = "black" 
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:activeColor,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 85,
          paddingBottom: 20,
          paddingTop: 15,
          paddingHorizontal: 10,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 20,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
         
        },
        tabBarLabelStyle: {
          fontSize: 11,
          // fontFamily:"Poppins_400Regular",
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
          borderRadius: 15,
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="home-outline"
              color={color}
              focused={focused}
              activeColor={"royalblue"}
              inactiveColor="#9CA3AF"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance/index"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="calendar-outline"
              color={color}
              focused={focused}
              activeColor={"#10B981"}
              inactiveColor="#9CA3AF"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="homework/index"
        options={{
          title: "Homework",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="book-outline"
              color={color}
              focused={focused}
              activeColor={"orange"}
              inactiveColor="#9CA3AF"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wellness/index"
        options={{
          title: "Health",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="medical-outline"
              color={color}
              focused={focused}
              activeColor={"red"}
              inactiveColor="#9CA3AF"
            />
          ),
        }}
      />

      <Tabs.Screen name="calendar/index" options={{ href: null }} />
      <Tabs.Screen name="communication/index" options={{ href: null }} />
      <Tabs.Screen name="events/gallery/index" options={{ href: null }} />
      <Tabs.Screen name="exam/index" options={{ href: null }} />
      <Tabs.Screen name="fee/index" options={{ href: null }} />
      <Tabs.Screen name="hostel/index" options={{ href: null }} />
      <Tabs.Screen name="library/index" options={{ href: null }} />
      <Tabs.Screen name="notice/index" options={{ href: null }} />
      <Tabs.Screen name="profile/index" options={{ href: null }} />
      <Tabs.Screen name="result/index" options={{ href: null }} />
      <Tabs.Screen name="syllabus/index" options={{ href: null }} />
      <Tabs.Screen name="timetable/index" options={{ href: null }} />
      <Tabs.Screen name="transport/index" options={{ href: null }} />
    </Tabs>
  )
}
