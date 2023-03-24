import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import Chat from "./components/Chat";
import { createStackNavigator } from "@react-navigation/stack";
import ShoppingList from "./components/ShoppingList";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./app-config";
import { getFirestore } from "firebase/firestore";
import Welcome from "./components/Welcome";
import Start from "./components/Start";
const Stack = createStackNavigator();

const App = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="ShoppingList">
          {(props) => <ShoppingList db={db} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
