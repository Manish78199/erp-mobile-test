import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ExamScreen } from '../screens/ExamScreen';
import { FeesScreen } from '../screens/FeesScreen';
import { NoticesScreen } from '../screens/NoticesScreen';
import { StudyMaterialsScreen } from '../screens/StudyMaterialsScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { TransportScreen } from '../screens/TransportScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { HostelScreen } from '../screens/HostelScreen';

const Stack = createStackNavigator();

export const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="Exam" component={ExamScreen} />
      <Stack.Screen name="Fees" component={FeesScreen} />
      <Stack.Screen name="Notices" component={NoticesScreen} />
      <Stack.Screen name="StudyMaterials" component={StudyMaterialsScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Transport" component={TransportScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Hostel" component={HostelScreen} />
    </Stack.Navigator>
  );
};
