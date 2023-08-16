import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Header from '../Components/Home/Header';
import GoogleMapView from '../Components/Home/GoogleMapView';
import CategoryList from '../Components/Home/CategoryList';
import GlobalApi from '../Services/GlobalApi';
import PlaceList from '../Components/Home/PlaceList';
import { UserLocationContext } from '../Context/UserLocationContext';
import { darkMode as theme } from '../theme';
import { LogBox } from 'react-native';

// Ignorar todas las advertencias
LogBox.ignoreAllLogs();

export default function Home() {
  const [placeList, setPlaceList] = useState([]);
  const { location, setLocation } = useContext(UserLocationContext);

  useEffect(() => {
    if (location) {
      GetNearBySearchPlace('restaurant, food, cafe, gas, school, gym, park, store, hospital, pharmacy, atm, bank, bar, bus_station, church, city_hall, courthouse, dentist, doctor, fire_station, library, museum, police, post_office, shopping_mall, spa, stadium, university, zoo');
    }
  }, [location]);

  const GetNearBySearchPlace = (value) => {
    GlobalApi.nearByPlace(location.coords.latitude, location.coords.longitude, value)
      .then((resp) => {
        setPlaceList(resp.data.results);
      })
      .catch((error) => {
        console.error('Error fetching nearby places:', error);
      });
  };

  return (
    <View style={{ padding:20, backgroundColor:'#fff', flex:1 }}>
      <ScrollView style={{ backgroundColor: theme.backgroundColor }}>
      {/* <Header /> */}
        {/* <GoogleMapView placeList={placeList} /> */}
        <CategoryList setSelectedCategory={(value) => GetNearBySearchPlace(value)} />
        {placeList.length > 0 ? <PlaceList placeList={placeList} /> : null}
      </ScrollView>
    </View>
  );
}
