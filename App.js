import React from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Marker } from "react-native-maps";

export default function App() {

  const [location, setLocation] = React.useState({
    latitude: 19.0000000,
    longitude:  -70.162651,
    latitudeDelta: 2,
    longitudeDelta: 2,
  });
  const [adrees, setAdrees] = React.useState();

  React.useEffect(() => {
    const permission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation?.coords?.latitude,
        longitude: currentLocation?.coords?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };
    permission();
  }, []);

  const geocode = async () => {
    const geolocaton = await Location.geocodeAsync(adrees);
    //TODO::validar si la direccion existe
    setLocation({
      latitude: geolocaton[0]?.latitude,
      longitude: geolocaton[0]?.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search location" value={adrees} onChangeText={setAdrees}/>
      <Button title="search adrees" onPress={geocode} />
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map}
          initialRegion={location}>
            <Marker coordinate={location}
            title="My Location" 
            />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  mapContainer: {
    width: '100%',
    height: '40%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  navBar: {
    backgroundColor: 'red',
  },
});
