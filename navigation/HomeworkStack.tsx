import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeworkScreen } from '../screens/HomeworkScreen';

const Stack = createStackNavigator();

export const HomeworkStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeworkHome" component={HomeworkScreen} />
    </Stack.Navigator>
  );
};
