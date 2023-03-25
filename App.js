import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
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

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="ShoppingList">
          {(props) => <ShoppingList db={db} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
