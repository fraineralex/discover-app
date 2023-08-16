import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Home from "../Screens/Home";
import Fav from "../Screens/Fav";
import Search from "../Screens/Search";
import Settings from "../Screens/Settings";
import LoginScreen from "../Screens/Login";
import HomeNavigation from "./HomeNavigation";
import SignUpScreen from "../Screens/Signup";
import Users from "../Screens/Users";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación para la pantalla de inicio de sesión
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Navegación de pestañas principal
const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Fav"
        component={Fav}
        options={{
          tabBarLabel: "Saved",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-save" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarLabel: "Users",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color="{color}" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function TabNavigation() {
  const userContext = useContext(UserContext);
  return (
    <NavigationContainer>
      {userContext.user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
