import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

const Chat = ({ storage, db, route, navigation, isConnected }) => {
  const { username, userId, color } = route.params;
  const [messages, setMessages] = useState([]);
  navigation.setOptions({
    title: `${username} ${!isConnected ? "(offline)" : ""}`,
  });

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return <Bubble {...props} />;
  };

  const saveMessageLocally = async (localMessage) => {
    const newMessage = localMessage.at(0);
    const allMessages = [newMessage, ...messages];
    await AsyncStorage.setItem("local_messages", JSON.stringify(allMessages));
    setMessages(allMessages);
  };

  const copyMessageToLocalStorage = async (messages) => {
    await AsyncStorage.setItem("local_messages", JSON.stringify(messages));
  };

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("local_messages");
    setMessages(JSON.parse(cachedMessages) || []);
  };

  const onSend = useCallback(async (message = []) => {
    if (isConnected) {
      const newMessage = await addDoc(
        collection(db, "messages"),
        message.at(0)
      );
      if (newMessage.id) {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessage)
        );
      } else {
        Alert.alert("Unable to add. Please try later");
      }
    } else saveMessageLocally(message);
  }, []);

  /* custom actions */
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      unsubMessages = onSnapshot(
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
          copyMessageToLocalStorage(dbMessages);
        }
      );
    } else loadCachedMessages();
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

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
        renderInputToolbar={(props) => <InputToolbar {...props} />}
        onSend={(messages) => onSend(messages)}
        renderUsername={(user) => <Text>{user.name}</Text>}
        renderActions={renderCustomActions}
        renderBubble={renderCustomView}
        alwaysShowSend
        minInputToolbarHeight={60}
        renderLoading={() => <ActivityIndicator animating={true} />}
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
