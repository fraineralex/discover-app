import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { UserContext } from '../Context/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseConfig } from '../config';
import { initializeApp } from 'firebase/app';
import { darkMode as theme } from '../theme';
import moment from 'moment';

export default function Settings() {
  const userContext = useContext(UserContext);
  const [createdAt, setCreatedAt] = useState('');
  const [lastLoginAt, setLastLoginAt] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const metadata = user.metadata;

      // Utilizar Moment.js para formatear las fechas
      const createdAtDate = new Date(metadata.creationTime);
      const lastLoginAtDate = new Date(metadata.lastSignInTime);

      setCreatedAt(moment(createdAtDate).fromNow());
      setLastLoginAt(moment(lastLoginAtDate).fromNow());
    }
  }, []);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    await signOut(auth);
    userContext.setUser(null);
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/user.png")} style={styles.userPhoto} />
      <Text style={styles.userInfoText}><Text style={{fontWeight: 'bold'}}>Name: </Text>{userContext.user.displayName}</Text>
      <Text style={styles.userInfoText}><Text style={{fontWeight: 'bold'}}>Email: </Text>{userContext.user.email}</Text>
      <Text style={styles.userInfoText}><Text style={{fontWeight: 'bold'}}>Created: </Text>{createdAt}</Text>
      <Text style={styles.userInfoText}><Text style={{fontWeight: 'bold'}}>Last Login: </Text>{lastLoginAt}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfoText: {
    fontSize: 20,
    marginTop: 10,
    color: theme.secondary,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: theme.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 16,
    color: theme.primary,
  },
});
