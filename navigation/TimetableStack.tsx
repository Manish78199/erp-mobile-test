import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TimetableScreen } from '../screens/TimetableScreen';

const Stack = createStackNavigator();

export const TimetableStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimetableHome" component={TimetableScreen} />
    </Stack.Navigator>
  );
};
