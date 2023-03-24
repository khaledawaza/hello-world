import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

const ShoppingList = ({ db, route }) => {
  const [list, setList] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const { userId } = route.params;

  const addShoppingList = async (newList) => {
    const newListRef = await addDoc(collection(db, "shoppingList"), newList);
    if (newListRef.id) {
      setList([...list, newList]);
      Alert.alert(`The list "${listName}" has been added.`);
    } else {
      Alert.alert("Unable to add. Please try later");
    }
  };

  useEffect(() => {
    const unsubShoppingList = onSnapshot(
      query(collection(db, "shoppingList"), where("userId", "==", userId)),
      (snapShot) => {
        let newLists = [];
        snapShot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        setList(newLists);
      }
    );

    return () => {
      if (unsubShoppingList) unsubShoppingList();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Shopping list</Text>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <Text>
            {item.name}: {item.items.join(", ")}
          </Text>
        )}
      />

      <View style={styles.listForm}>
        <TextInput
          style={styles.listName}
          placeholder="List Name"
          value={listName}
          onChangeText={setListName}
        />
        <TextInput
          style={styles.item}
          placeholder="Item #1"
          value={item1}
          onChangeText={setItem1}
        />
        <TextInput
          style={styles.item}
          placeholder="Item #2"
          value={item2}
          onChangeText={setItem2}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            const newList = {
              userId: userId,
              name: listName,
              items: [item1, item2],
            };
            addShoppingList(newList);
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
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
  listItem: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    flex: 1,
    flexGrow: 1,
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC",
  },
  listName: {
    height: 50,
    padding: 15,
    fontWeight: "600",
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#000",
    color: "#FFF",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default ShoppingList;
