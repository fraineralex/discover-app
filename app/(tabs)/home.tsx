import React from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Marker } from "react-native-maps";
import { useRouter, Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseConfig } from '../config';
import { initializeApp } from 'firebase/app';

export default function HomeScreen() {
  const [location, setLocation] = React.useState({
    "locationName": "Dominican Republic",
    "locationMarker": {
      latitude: 19.0000000,
      longitude: -70.162651,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
  });
  const [adrees, setAdrees] = React.useState('');
  const [markerPlaces, setMarkerPlaces] = React.useState([]);
  const [user, setUser] = React.useState(null)
  const router = useRouter();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  React.useEffect(() => {
    const permission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        "locationName": "My location",
        "locationMarker": {
          latitude: currentLocation?.coords?.latitude,
          longitude: currentLocation?.coords?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      });
    };

    async function checkUser() {
      const currentUser = JSON.parse(await SecureStore.getItemAsync('user'));
      console.log(currentUser);
      const token = await SecureStore.getItemAsync('token');
      if (!user && !token) {
        router.replace('/login');
      }

      setUser(currentUser);
    }

    checkUser();
    permission();
  }, []);

  const get_locations = async () => {
    const geolocaton = await Location.geocodeAsync(adrees);
    const newMarkerPlaces = [...markerPlaces, location];
    const geolocation_obj = {
      "locationName": adrees,
      "locationMarker": {
        latitude: geolocaton[0]?.latitude,
        longitude: geolocaton[0]?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    };

    setMarkerPlaces([...newMarkerPlaces, geolocation_obj]);
    setLocation(geolocation_obj);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* map */}
        <MapView
          style={styles.map}
          region={location.locationMarker}
        >
          <Marker coordinate={location.locationMarker} title={location.locationName} />
          {
            markerPlaces.length > 0 && markerPlaces.map((marker, index) => (
              <Marker key={index} coordinate={marker.locationMarker} title={marker.locationName} />
            ))
          }
        </MapView>

        {/* search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput} 
            placeholder="Search location" 
            value={adrees} 
            onChangeText={text => setAdrees(text)} 
          />
          <Button
            style={styles.searchBnt} 
            title="search" 
            onPress={get_locations} 
            />
        </View>

        {/* logout */}
        <View style={styles.logoutBnt}>
          <TouchableOpacity
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  logoutBnt: {
    position: 'absolute',
    top: "80%",
    left: "5%",
    backgroundColor: '#35363a',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#35363a',
    shadowColor: '#35363a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
    borderRadius: 50,
  },
  logoutText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 16,
  },
  searchContainer: {
    position: 'absolute',
    top: "10%",
    left: "3%",
    right: "3%",
    backgroundColor: '#35363a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#35363a',
    shadowColor: '#35363a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
    borderRadius: 50,
  },
  searchInput: {
    width: '70%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
  },
  searchBnt: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 10,
  },
});