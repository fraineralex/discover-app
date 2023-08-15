import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import GoogleMapViewFull from '../Components/Search/GoogleMapViewFull'
import SearchBar from '../Components/Search/SearchBar'
import { UserLocationContext } from '../Context/UserLocationContext';
import GlobalApi from '../Services/GlobalApi'
import BusinessList from '../Components/Search/BusinessList';
import * as SecureStore from 'expo-secure-store';
import { getPlacesByUserId } from '../database/Place';

export default function Search() {
  const [placeList,setPlaceList]=useState([]);
  const {location,setLocation}=useContext(UserLocationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
  }, []);
  
  return (
    <View>
      <View style={{position:'absolute',zIndex:20}}>
        <SearchBar setSearchText={(value)=>GetNearBySearchPlace(value)} />
      </View>
   
      <GoogleMapViewFull placeList={placeList}/>
      <View style={{position:'absolute',zIndex:20,bottom:0}}>
        <BusinessList placeList={placeList} />
      </View>
     
    </View>
  )
}