import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "styled-components";
import { ToastProvider } from "react-native-styled-toast";
import { theme } from "./src/core/theme";
import LoginScreen from "./src/screens/Login";
import DashboardScreen from "./src/screens/Dashboard";
import RegisterScreen from "./src/screens/Register";
import OrderDetailsScreen from "./src/screens/OrderDetails";
import MapDirectionsScreen from "./src/screens/MapDirections";

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
    <ThemeProvider theme={theme}>
      <ToastProvider offset={100} maxToasts={1}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initScreen}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="MapDirections"
              component={MapDirectionsScreen}
              options={({ route }) => ({ title: route.params.name })}
            />
            <Stack.Screen
              name="OrderDetails"
              component={OrderDetailsScreen}
              options={{ title: "Order Details" }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </ThemeProvider>
  );
}
