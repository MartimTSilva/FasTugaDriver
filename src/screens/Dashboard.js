import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { db } from "../../firebase";

export default function Dashboard({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      AsyncStorage.getItem("@userData").then((data) => {
        db.collection("users")
          .doc(JSON.parse(data).id)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              setUser(snapshot.data());
            }
          });
      });
    } catch (error) {}
  }, []);

  const onLogout = () => {
    AsyncStorage.removeItem("@userData");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Hello {user?.name}!</Text>
      <Button onPress={onLogout} title="Logout"></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
