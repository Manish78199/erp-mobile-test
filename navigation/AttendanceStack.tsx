import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AttendanceScreen } from '../screens/AttendanceScreen';

const Stack = createStackNavigator();

export const AttendanceStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AttendanceHome" component={AttendanceScreen} />
    </Stack.Navigator>
  );
};
