import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import { Card, Divider, ProgressBar } from "react-native-paper";
import { SafeAreaView, StyleSheet } from "react-native";
import { db } from "../../firebase";
import { theme } from "../core/theme";
import * as Location from "expo-location";
import {
  fetchDriverOrdersAPI,
  fetchUnassignedOrdersAPI,
} from "../stores/orders";

export default function Dashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);
  const [selfOrder, setSelfOrder] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  //on drag down refresh page
  async function fetchPrivateInfo() {
    try {
      const userID = JSON.parse(await AsyncStorage.getItem("@userData")).id;

      await db
        .collection("users")
        .doc(userID)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          }

          fetchDriverOrdersAPI(snapshot.id).then((orders) => {
            setSelfOrder(
              orders.docs.map((doc) => {
                return { key: doc.id, ...doc.data() };
              })
            );
          });
        });
    } catch (error) {}
  }

  async function getUnassignedOrders() {
    await fetchUnassignedOrdersAPI()
      .then((orders) => {
        setOrder(
          orders.docs.map((doc) => {
            return { key: doc.id, ...doc.data() };
          })
        );
      })
      .finally(() => setLoading(false));
  }
  //This fixes the Absolute Sº!º that is Javascript

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setLocation(location);
  }

  async function refresh() {
    await getLocation();
    await fetchPrivateInfo();
    await getUnassignedOrders();
  }

  function viewOrderDetails(order) {
    navigation.navigate("OrderDetails", {
      ...order,
      MEMElatitude: location.coords.latitude,
      MEMElongitude: location.coords.longitude,
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  const onLogout = () => {
    AsyncStorage.removeItem("@userData");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* <Button onPress={onLogout} title="Logout"></Button>
      <Text>Hello {user?.name}!</Text> */}
      <Card style={styles.card}>
        <Card.Title title="Available Orders" titleStyle={styles.cardTitle} />
        {isLoading ? (
          <ProgressBar color={theme.colors.primary} indeterminate={true} />
        ) : (
          <Divider />
        )}
        <Card.Content>
          <OrderList
            data={order}
            updateCallback={refresh}
            onPressOrder={viewOrderDetails}
          ></OrderList>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="My Orders" titleStyle={styles.cardTitle} />
        {isLoading ? (
          <ProgressBar color={theme.colors.primary} indeterminate={true} />
        ) : (
          <Divider />
        )}
        <Card.Content>
          <OrderList
            data={selfOrder}
            updateCallback={refresh}
            onPressOrder={viewOrderDetails}
          ></OrderList>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 20,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 19,
    paddingTop: 8,
  },
});
