import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log("props: ", this.props);
    const { color, name } = this.props.route.params;
    return (
      <View
        style={{
          backgroundColor: color,
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: "30" }}>Hello {name}</Text>
      </View>
    );
  }
}
