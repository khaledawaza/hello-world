import React from "react";

import Start from "./components/Start";
import Chat from "./components/Chat";

import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const Stack = createStackNavigator();

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
