import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

export default function Dashboard({ navigation }) {
  const onLogout = () => {
    AsyncStorage.removeItem("@userData");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Hello !</Text>
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
