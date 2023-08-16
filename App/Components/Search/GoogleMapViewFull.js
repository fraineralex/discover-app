import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, TextInput, Keyboard, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserLocationContext } from '../../Context/UserLocationContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions } from 'react-native';
import PlaceMarker from '../Home/PlaceMarker';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { savePlace } from '../../database/Place';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import StarRating from './Rating';
import { Octicons } from '@expo/vector-icons';

export default function GoogleMapViewFull({ placeList }) {
  const [mapRegion, setMapRegion] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [formattedAddress, setFormattedAddress] = useState('');
  const [geometry, setGeometry] = useState({
    location: {
      lat: 0,
      lng: 0,
    },
    viewport: {
      northeast: {},
      southwest: {},
    },
  });
  const [photos, setPhotos] = useState([
    {
      height: 0,
      html_attributions: [],
      photo_reference: '',
      width: 0,
    },
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { location, setLocation } = useContext(UserLocationContext);
  const [selectedRating, setSelectedRating] = useState(0);
  const [mapType, setMapType] = useState('standard');

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const currentUser = JSON.parse(await SecureStore.getItemAsync('user'));
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setUser(currentUser);
      }

    })();
  }, []);

  const handleMapTypeChange = () => {
    // Cambiar el tipo de mapa
    if (mapType === 'standard') {
      setMapType('satellite');
    } else if (mapType === 'satellite') {
      setMapType('hybrid');
    } else if (mapType === 'hybrid') {
      setMapType('terrain');
    } else {
      setMapType('standard');
    }
  };

  const handleSavePlace = () => {
    const newPlace = {
      formatted_address: formattedAddress,
      geometry: geometry,
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png',
      icon_background_color: '#7B9EB0',
      icon_mask_base_uri: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet',
      name: placeName,
      photos: photos,
      types: ['locality', 'political', 'point_of_interest', 'establishment', 'park', 'restaurant', 'store', 'university',],
      place_id: `${formattedAddress}-${geometry.location.lat}-${geometry.location.lng}`.trim(),
      reference: `${formattedAddress}-${geometry.location.lat}-${geometry.location.lng}`.trim(),
      user_ratings_total: selectedRating * 53,
      rating: selectedRating === 5 ? 5 : selectedRating + Math.round(Math.random() * selectedRating) / 10,
    }
    console.log(newPlace);

    if (user) {
      savePlace(newPlace, user.uid, (insertId) => {
        if (insertId !== null) {
          // Place saved successfully
          console.log('Place saved successfully');
        } else {
          console.error('Error saving place');
        }
      });
    } else {
      console.warn('User not authenticated. Cannot save place.');
    }
    setModalVisible(false);
    setSelectedImage(null);
    setPlaceName('');
    setFormattedAddress('');
    setPhotos([]);
    setGeometry({});
  };

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  const handleMapLongPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedPlace({ lat: coordinate.latitude, lng: coordinate.longitude });
    setGeometry({
      location: {
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      },
      viewport: {
        northeast: {},
        southwest: {},
      },
    });
    setModalVisible(true);
  };


  const handleModalDismiss = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setPlaceName('');
    setFormattedAddress('');
    setPhotos([]);
  };

  const handleChooseImage = async () => {
    const imageResult = await ImagePicker.launchImageLibraryAsync();
    if (imageResult.canceled) {
      console.log('Image selection was cancelled');
      return;
    }
    const { uri, height, width } = imageResult.assets[0];

    setPhotos([{
      height: height,
      html_attributions: [],
      photo_reference: uri,
      width: width,
      origin: 'local'
    }]);

    setSelectedImage(uri);
  };

  const handleTakeImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access media library was denied');
      return;
    }

    const imageResult = await ImagePicker.launchCameraAsync();
    if (imageResult.canceled) {
      console.log('Image capture was cancelled');
      return;
    }
    const { uri, height, width } = imageResult;

    setPhotos([
      {
        height: height,
        html_attributions: [],
        photo_reference: uri,
        width: width,
        origin: 'local'
      },
    ]);
    setSelectedImage(uri);
  };

  return (
    <View>
      {location ? (
        <MapView
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height * 0.89,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={mapRegion}
          onLongPress={handleMapLongPress}
          mapType={mapType}
        >

          <Marker title="You" coordinate={mapRegion} />
          {placeList.map((item, index) =>
            index <= 4 ? (
              <PlaceMarker
                key={index}
                coordinate={{
                  latitude: item.lat,
                  longitude: item.lng,
                }}
                item={item}
              />
            ) : null
          )}
        </MapView>
      ) : null}

      <TouchableOpacity
        style={styles.mapTypeButton}
        onPress={handleMapTypeChange}
      >
        <Octicons name="stack" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalDismiss}
      >
        <TouchableWithoutFeedback onPress={handleModalDismiss}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Save Place</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#777"
                  value={placeName}
                  onChangeText={setPlaceName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#777"
                  value={formattedAddress}
                  onChangeText={setFormattedAddress}
                />
                <StarRating rating={selectedRating} onChangeRating={setSelectedRating} />

                {!selectedImage && (
                  <View style={styles.chooseImageButtonsContainer}>
                    <TouchableOpacity
                      style={styles.chooseImageButton}
                      onPress={handleChooseImage}
                    >
                      <Text style={styles.chooseImageText}>Choose Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.chooseImageButton}
                      onPress={handleTakeImage}
                    >
                      <Text style={styles.chooseImageText}>Take Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedImage && (
                  <View style={{ marginTop: 10, marginBottom: 20 }}>
                    <Image source={{ uri: photos[0].photo_reference }} style={{ width: 260, height: 150, borderRadius: 20 }} />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.searchButtonModal}
                  onPress={handleSavePlace}
                >
                  <Text style={styles.searchButtonText}>Save Place</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#0069D9',
    padding: 10,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    height: 40,
    borderRadius: 5,
    borderColor: '#999',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF',
    backgroundColor: '#333',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinatesInput: {
    flex: 1,
  },
  searchButtonModal: {
    backgroundColor: '#0069D9',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chooseImageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  chooseImageButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '48%',
  },
  chooseImageText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedImage: {
    width: Dimensions.get('window').width - 64,
    height: Dimensions.get('window').width - 64,
    borderRadius: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  mapTypeButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  mapTypeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

