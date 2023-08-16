import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TabNavigation from "./App/Navigations/TabNavigation";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import { UserLocationContext } from "./App/Context/UserLocationContext";
import { UserContext } from "./App/Context/UserContext";
import Colors from "./App/Shared/Colors";
import * as SecureStore from "expo-secure-store";
import LoginScreen from "./App/Screens/Login";
import "./App/database/Place";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    raleway: require("./assets/Fonts/Raleway-Regular.ttf"),
    "raleway-bold": require("./assets/Fonts/Raleway-SemiBold.ttf"),
  });

  /* useEffect(() => {
    (async () => {
      const currentUser = JSON.parse(await SecureStore.getItemAsync("user"));
      const token = await SecureStore.getItemAsync("token");
      if (token && currentUser) {
        setUser(currentUser);
      }
    })();
  }, []); */

  useEffect(() => {
    console.log("App render");
    if (user) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }

  }, [user]);

  return (
    <View style={styles.container}>
      <UserContext.Provider value={{ user, setUser }}>
        <UserLocationContext.Provider value={{ location, setLocation }}>
          <TabNavigation />
        </UserLocationContext.Provider>
      </UserContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: 20,
  },
});
