import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ db, route, navigation }) => {
  const { username, userId, color } = route.params;
  const [messages, setMessages] = useState([]);

  navigation.setOptions({ title: username });

  const onSend = useCallback(async (message = []) => {
    console.log("message: ", message.at(0));
    const newMessage = await addDoc(collection(db, "messages"), message.at(0));
    console.log("new message");
    if (newMessage.id) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessage)
      );
    } else {
      Alert.alert("Unable to add. Please try later");
    }
  }, []);

  useEffect(() => {
    const unsubMessages = onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const dbMessages = [];
        snapshot.forEach((doc) => {
          dbMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        setMessages(dbMessages);
      }
    );

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingBottom: 15,
        backgroundColor: color,
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderUsername={(user) => <Text>{user.name}</Text>}
        alwaysShowSend
        minInputToolbarHeight={60}
        renderLoading={() => <ActivityIndicator />}
        user={{
          _id: userId,
          name: username,
        }}
      />
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="position" />
      ) : null}
    </View>
  );
};

export default Chat;
