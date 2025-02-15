import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { View, Text } from 'react-native';
import MainScreen from '../pages/main';
import InformationScreen from '../pages/information';
import FridgeScreen from '../pages/fridge';
import SettingsScreen from '../pages/settings';
import NotificationsScreen from '../pages/notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

const MainMenu: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';

          if (route.name === 'Main Menu') iconName = 'home';
          else if (route.name === 'Information') iconName = 'information-circle';
          else if (route.name === 'Fridge') iconName = 'snow';
          else if (route.name === 'Settings') iconName = 'settings';
          else if (route.name === 'Notifications') iconName = 'notifications';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Main Menu" component={MainScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Information" component={InformationScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Fridge" component={FridgeScreen} options={{ headerShown: false }}  />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}  />
    </Tab.Navigator>
  );
};

export default MainMenu;
