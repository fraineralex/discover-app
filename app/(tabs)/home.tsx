import React from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Marker } from "react-native-maps";

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
  const [adrees, setAdrees] = React.useState();
  const [markerPlaces, setMarkerPlaces] = React.useState([]);

  React.useEffect(() => {
    const permission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        "locationName": "My location 22",
        "locationMarker": {
          latitude: currentLocation?.coords?.latitude,
          longitude: currentLocation?.coords?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      });
    };
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

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search location" value={adrees} onChangeText={setAdrees} />
      <Button title="search adrees" onPress={get_locations} />
      <View style={styles.mapContainer}>
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