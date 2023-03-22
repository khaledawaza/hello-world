import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import Start from "./components/Start";
import Chat from "./components/Chat";

import "react-native-gesture-handler";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC06-qqiroljqJPbPt4coHND2PpwxJktNI",
  authDomain: "chatapp-15c7e.firebaseapp.com",
  projectId: "chatapp-15c7e",
  storageBucket: "chatapp-15c7e.appspot.com",
  messagingSenderId: "414574732954",
  appId: "1:414574732954:web:ebbcb95472cc6d2710a123",
  measurementId: "G-W1B2EX5SWD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

<Stack.Screen name="ShoppingLists" component={ShoppingLists} />;
<Stack.Screen name="ShoppingLists">
  {(props) => <ShoppingLists db={db} {...props} />}
</Stack.Screen>;

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={({ route }) => ({ title: route.params.name })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
