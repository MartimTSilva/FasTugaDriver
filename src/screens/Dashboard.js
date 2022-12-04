import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import { Card, Divider, ProgressBar } from "react-native-paper";
import { SafeAreaView, StyleSheet, Text, Button, View } from "react-native";
import { db } from "../../firebase";
import {
  fetchDriverOrdersAPI,
  fetchUnassignedOrdersAPI,
} from "../stores/oders";
import { theme } from "../core/theme";

export default function Dashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);
  const [selfOrder, setSelfOrder] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //on drag down refresh page
  async function fetchPrivateInfo() {
    try {
	  const userID=0;
	  //if user params were sent from login screen fetch them from there
	  if (navigation.state.params) {
		userID = navigation.state.params.id;
	  }else{
		//else fetch them from async storage
		userID = JSON.parse(await AsyncStorage.getItem("@userData")).id;
	  }
      
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

  async function refresh() {
    await fetchPrivateInfo();
    await getUnassignedOrders();
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
      <Card style={styles.card}>
        <Card.Title title="Available Orders" titleStyle={styles.cardTitle} />
        {isLoading ? (
          <ProgressBar color={theme.colors.primary} indeterminate={true} />
        ) : (
          <Divider />
        )}
        <Card.Content>
          <OrderList data={order} updateCallback={refresh}></OrderList>
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
          <OrderList data={selfOrder} updateCallback={refresh}></OrderList>
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
