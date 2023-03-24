import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation, route }) => {
  const { username, color } = route.params;
  const auth = getAuth();

  async function login() {
    try {
      const res = await signInAnonymously(auth);
      navigation.navigate("Chat", { color, userId: res.user.uid, username });
      Alert.alert("Signin successful");
    } catch (err) {
      console.log(err);
      Alert.alert("Authentication error. Try again.");
    }
  }
  return (
    <View style={styles.container}>
      <Text>Welcome {username}</Text>
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={{ color: "#fff" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "black",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    fontFamily: "sans-serif",
  },
});

export default Welcome;
