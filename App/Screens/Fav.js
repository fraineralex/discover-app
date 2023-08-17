import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import GoogleMapViewFull from '../Components/Search/GoogleMapViewFull';
import SearchBar from '../Components/Search/SearchBar';
import { UserLocationContext } from '../Context/UserLocationContext';
import GlobalApi from '../Services/GlobalApi';
import BusinessList from '../Components/Search/BusinessList';
import * as SecureStore from 'expo-secure-store';
import { getPlacesByUserId } from '../database/Place';
import { SimpleLineIcons } from '@expo/vector-icons';

export default function Search() {
  const [placeList, setPlaceList] = useState([]);
  const { location, setLocation } = useContext(UserLocationContext);
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPlaces = () => {
    (async () => {
      const currentUser = JSON.parse(await SecureStore.getItemAsync('user'));
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setUser(currentUser);

        getPlacesByUserId(currentUser.uid, (result) => {
          setPlaceList(result);
        });
      }
    })();
  };

  useEffect(() => {
    fetchPlaces();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', zIndex: 20, top: 20, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Saved Places</Text>
      </View>

      <GoogleMapViewFull placeList={placeList} />
      
      <View style={{ position: 'absolute', zIndex: 20, bottom: 0 }}>
        <View style={{ flex: 1 }}>
          <BusinessList placeList={placeList} />
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(240, 240, 240, 0.5)',
            padding: 10,
          }}
        >
          <Text><SimpleLineIcons name="refresh" size={15} color="black" /> Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
