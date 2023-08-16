import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import * as SecureStore from "expo-secure-store";
import { UserContext } from '../Context/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseConfig } from '../config';
import { initializeApp } from 'firebase/app';

export default function Profile() {
  const userContext = useContext(UserContext);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    await signOut(auth);
    userContext.setUser(null);
  };

  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity style={{ marginTop: 20 }} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
