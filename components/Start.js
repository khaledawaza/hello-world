import { getAuth, signInAnonymously } from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Platform,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const backgroundColors = {
  black: { backgroundColor: "#090c08" },
  purple: { backgroundColor: "#474056" },
  grey: { backgroundColor: "#8a95a5" },
  green: { backgroundColor: "#b9c6ae" },
};

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const { black, purple, grey, green } = backgroundColors;
  const [color, setColor] = useState(black.backgroundColor);
  const auth = getAuth();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ImageBackground
          source={require("../assets/bg.png")}
          style={[styles.container, styles.image]}
        >
          <Text style={styles.title}>App Title</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.nameBox}
              onChangeText={(name) => setName(name)}
              value={name}
              placeholder="Enter your Name"
            />
            <View>
              <Text style={styles.colorText}>Choose your Background:</Text>
              <View style={styles.colorWrapper}>
                <TouchableOpacity
                  style={[styles.color, black]}
                  onPress={() => setColor(black.backgroundColor)}
                />
                <TouchableOpacity
                  style={[styles.color, purple]}
                  onPress={() => setColor(purple.backgroundColor)}
                />
                <TouchableOpacity
                  style={[styles.color, grey]}
                  onPress={() => setColor(grey.backgroundColor)}
                />
                <TouchableOpacity
                  style={[styles.color, green]}
                  onPress={() => setColor(green.backgroundColor)}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.nameBox, styles.chatBox]}
              onPress={async () => {
                const res = await signInAnonymously(auth);
                navigation.navigate("Chat", {
                  username: name,
                  color,
                  userId: res.user.uid,
                });
              }}
            >
              <Text style={[styles.colorText, styles.chatBoxText]}>
                Start Chatting
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
    marginTop: 60,
  },
  inputBox: {
    backgroundColor: "#fff",
    height: "44%",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingVertical: 20,
  },
  nameBox: {
    height: 50,
    width: "88%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 2,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 50,
    paddingHorizontal: 10,
  },
  colorText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 100,
  },
  colorWrapper: {
    flexDirection: "row",
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  chatBox: {
    backgroundColor: "#757083",
    justifyContent: "center",
  },
  chatBoxText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Start;
