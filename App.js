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
const Stack = createStackNavigator();

const App = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ShoppingList">
          {(props) => <ShoppingList db={db} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
