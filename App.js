import React, { useEffect } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Button } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Chat from "./components/Chat";
import { createStackNavigator } from "@react-navigation/stack";
import ShoppingList from "./components/ShoppingList";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./app-config";
import {
  disableNetwork,
  enableNetwork,
  getFirestore,
} from "firebase/firestore";
import Start from "./components/Start";
import { Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
const Stack = createStackNavigator();

const App = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const connectionStatus = useNetInfo();
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) setImage(result.assets[0]);
      else setImage(null);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from the library" onPress={pickImage} />
      <Button title="Take a photo" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default App;
