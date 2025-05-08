// npm install @react-navigation/native
// npm install @react-navigation/stack
// npm install @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //for bottom tab of MainMenuScreen
import HomeScreen from '../pages/HomeScreen'
import MainMenuScreen from '../pages/MainMenuScreen'
import InformationScreen from '../pages/InformationScreen'
import FridgeScreen from '../pages/FridgeScreen'
import OkraInfo from '../pages/vegInfo/OkraInfo';
import CarrotInfo from '../pages/vegInfo/CarrotInfo';
import LettuceInfo from '../pages/vegInfo/LettuceInfo';
import { enableScreens } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


enableScreens(); // optimizes navigation performance

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainMenuTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fcfcfc', // Tab background color
            height: 90, // Adjust height
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            paddingTop:10,
          },
          tabBarLabelStyle: {
            marginTop:3,
            fontSize: 10, // Label size
            fontWeight: '700',
            color:'black',
          },
          tabBarActiveTintColor: 'black', // Active tab color
          tabBarInactiveTintColor: 'black', // Inactive tab color
          tabBarIcon: ({ focused, color }) => {
            let iconName = 'help-circle'; // Default icon if no match
            let IconComponent = Ionicons;
            let iconSize = 25

            if (route.name === 'Main Menu') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Information') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'Fridge') {
                iconName = focused ? 'fridge' : 'fridge-outline';
                IconComponent = MaterialCommunityIcons;
            }
          
            return <IconComponent name={iconName} size={iconSize} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Main Menu" component={MainMenuScreen} />
        <Tab.Screen name="Fridge" component={FridgeScreen} />
        <Tab.Screen name="Information" component={InformationScreen} />
      </Tab.Navigator>
    );
  };

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>   
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="MainMenu" component={MainMenuTabs} />
                <Stack.Screen name="Okra" component={OkraInfo} />
                <Stack.Screen name="Lettuce" component={LettuceInfo} />
                <Stack.Screen name="Carrot" component={CarrotInfo} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;