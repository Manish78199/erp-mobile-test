import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token = null;

  try {
    if (Platform.OS === 'web') {
      console.warn('Push notifications are not supported on web without VAPID key.');
      return null;
    }

    if (!Device.isDevice) {
      console.log('Push notifications require a physical device.');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission for push notifications was denied.');
      return null;
    }

    const expoTokenResponse = await Notifications.getDevicePushTokenAsync();
    token = expoTokenResponse.data;
    console.log('Expo Push Token:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: "default",
      });
    }
  } catch (error) {
    console.error('Error while registering for push notifications:', error);
    return null
  }

  return token;
}
