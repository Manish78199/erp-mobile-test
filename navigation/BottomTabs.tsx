import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import stack navigators for each tab
import { DashboardStack } from './DashboardStack';
import { ProfileStack } from './ProfileStack';
import { AttendanceStack } from './AttendanceStack';
import { TimetableStack } from './TimetableStack';
import { HomeworkStack } from './HomeworkStack';

const Tab = createBottomTabNavigator();

// Simple icon component (you can replace with react-native-vector-icons)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <Typography className={`text-lg ${focused ? 'text-primary-600' : 'text-gray-400'}`}>
    {name}
  </Typography>
);

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="📅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Timetable"
        component={TimetableStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="🕒" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Homework"
        component={HomeworkStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
