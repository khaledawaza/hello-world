import { useState } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";

const ShoppingLists = ({ db }) => {
  const [lists, setLists] = useState([]);

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <Text>
            {item.name}: {item.items.join(", ")}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ShoppingLists;
