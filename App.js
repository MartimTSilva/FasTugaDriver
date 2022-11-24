import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/Login";
import DashboardScreen from "./src/screens/Dashboard";
import RegisterScreen from "./src/screens/Register";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initScreen, setInitScreen] = useState(null);

  useEffect(() => {
    try {
      AsyncStorage.getItem("@userData").then((data) =>
        data !== null ? setInitScreen("Dashboard") : setInitScreen("Login")
      );
    } catch (e) {
      console.log("AsyncStorage Error: ", e);
    }
  }, []);

  if (initScreen === null) return;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initScreen}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
