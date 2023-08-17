import { View, Text } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../Shared/Colors";
import { Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import GoogleMapView from "../Home/GoogleMapView";
import { TouchableOpacity } from "react-native";
import Share from "../../Services/Share";
import { savePlace, getPlacesByUserId } from "../../database/Place";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { UserContext } from "../../Context/UserContext";

export default function PlaceDetailItem({ place, onDirectionClick }) {
  const userContext = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getPlacesByUserId(userContext.user.uid, (result) => {
      if (result) {
        result.forEach((item) => {
          if (item.place_id === place.place_id) {
            setIsSaved(true);
          }
        });
      }
    });
  }, []);

  const handleSavePlace = () => {
    if (userContext.user) {
      savePlace(place, userContext.user.uid, (insertId) => {
        if (insertId !== null) {
          // Place saved successfully
          Alert.alert("Place saved successfully");
          setIsSaved(true);
        } else {
          Alert.alert("This place is already saved");
        }
      });
    } else {
      console.warn("User not authenticated. Cannot save place.");
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 26, fontFamily: "raleway-bold" }}>
        {place.name}
      </Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginTop: 5,
          flexDirection: "row",
        }}
      >
        <AntDesign name="star" size={20} color={Colors.YELLOW} />
        <Text>{place.rating}</Text>
      </View>
      {place?.photos && place.photos[0]?.origin === "local" ? (
        <Image
          source={{ uri: place.photos[0]?.photo_reference }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 15,
            marginTop: 10,
          }}
        />
      ) : place?.photos ? (
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo" +
              "?maxwidth=400" +
              "&photo_reference=" +
              place?.photos[0]?.photo_reference +
              "&key=AIzaSyAlIDUiTW6M9p6qb7mHsMCvqk0_OMO3MV0",
          }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 15,
            marginTop: 10,
          }}
        />
      ) : null}
      <Text
        style={{ fontSize: 16, marginTop: 10, color: Colors.DARK_GRAY }}
        numberOfLines={2}
      >
        {place.vicinity ? place.vicinity : place.formatted_address}
      </Text>
      {place?.opening_hours ? (
        <Text style={{ fontFamily: "raleway" }}>
          {place?.opening_hours?.open_now == true ? "(Open)" : "(Closed)"}
        </Text>
      ) : null}

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          display: "flex",
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => onDirectionClick()}
          style={{
            direction: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: Colors.GRAY,
            width: 110,
            padding: 3,
            borderRadius: 40,
            justifyContent: "center",
          }}
        >
          <Ionicons name="navigate-circle-outline" size={24} color="black" />
          <Text style={{ fontFamily: "raleway", fontSize: 16 }}>Direction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Share.SharePlace(place)}
          style={{
            direction: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: Colors.GRAY,
            width: 90,
            padding: 3,
            borderRadius: 40,
            justifyContent: "center",
          }}
        >
          <Ionicons name="md-share-outline" size={24} color="black" />
          <Text style={{ fontFamily: "raleway", fontSize: 16 }}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSavePlace}
          style={{
            direction: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: Colors.GRAY,
            width: 90,
            padding: 3,
            borderRadius: 40,
            justifyContent: "center",
          }}
        >
          {isSaved ? (
            <MaterialCommunityIcons
              name="content-save-check"
              size={24}
              color="blue"
            />
          ) : (
            <Ionicons name="save-outline" size={24} color="black" />
          )}
          {isSaved ? (
            <Text style={{ fontFamily: "raleway", fontSize: 16 }}>Saved</Text>
          ) : (
            <Text style={{ fontFamily: "raleway", fontSize: 16 }}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
