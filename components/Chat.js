import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

// Google firebase / firestore
const firebase = require("firebase");
require("firebase/firestore");
// Your web app's Firebase configuration
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
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      uid: null,
      messages: [],
      username: "",
      user: {
        _id: "",
        avatar: "",
        name: "",
      },
      loggedInText: "Please standby...",
      isConnected: false,
      image: null,
      location: null,
    };
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.getMessages();
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
      } else {
        this.setState({ isConnected: false });
      }
    });

    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user?.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placekitten.com/140/140",
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentDidUpdate() {
    // chat screen top title is set to the name passed from Start.js
    this.props.navigation.setOptions({ title: this.props.route.params.name });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        const message = messages[0];
        this.addMessage(message);
        this.saveMessages();
      }
    );
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Get the data
  onCollectionUpdate = (querySnapshot) => {
    if (!this.state.isConnected) return;
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({ messages });
  };

  addMessage(message) {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: this.state.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // stylize chat text bubbles
  renderBubble(props) {
    let bgColor = this.props.route.params.bgColor;
    // custom to whichever bg is chosen. set to #656565 by default
    let userBubbleColor =
      bgColor === "#000000"
        ? "#656565"
        : bgColor === "#8a95a5"
        ? "#656565"
        : bgColor === "#474056"
        ? "#656565"
        : bgColor === "#94ae89"
        ? "#656565"
        : "#656565";
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#fff",
          },
          right: {
            backgroundColor: userBubbleColor,
          },
        }}
      />
    );
  }

  //render the default InputToolbar only when the user is online
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
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
    return null;
  }

  render() {
    // chat screen background color and top title is set to the bgColor and name passed from Start.js
    let bgColor = this.props.route.params.bgColor;
    return (
      <ActionSheetProvider>
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderActions={this.renderCustomActions.bind(this)}
            renderCustomView={this.renderCustomView}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.uid,
              avatar: "https://placeimg.com/140/140/any",
            }}
          />
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
