import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { darkMode as theme } from '../theme';

const TabsLayout = () => {
  return (
    <Tabs
    tabBarOptions={{
      activeTintColor: theme.tabActive,
      inactiveTintColor: theme.tabInactive,
      style: {
        backgroundColor: theme.primary,
      },
      indicatorStyle: {
        backgroundColor: theme.secondary,
      },
    }}
    >
      <Tabs.Screen
        name="login"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ marginBottom: focused ? -5 : 0 }}>
              <Entypo name="home" size={size} color={color} />
          </View>
          ),
          tabBarStyle: {borderTopWidth: 0},
          tabBarLabel: () => null,
          tabBarActiveBackgroundColor: theme.primary,
          tabBarInactiveBackgroundColor: theme.primary,
          headerTitleStyle: {fontSize: 20, fontWeight: 'bold', },
          headerTitle: 'LOGIN',
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
        }}
      />
    </Tabs>
  );
};