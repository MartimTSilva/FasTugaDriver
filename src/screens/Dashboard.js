import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import { Card, Divider, ProgressBar } from "react-native-paper";
import { SafeAreaView, StyleSheet } from "react-native";
import { db } from "../../firebase";
import {
  fetchDriverOrdersAPI,
  fetchUnassignedOrdersAPI,
} from "../stores/orders";
import { theme } from "../core/theme";

export default function Dashboard({ route, navigation }) {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);
  const [selfOrder, setSelfOrder] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //on drag down refresh page
  async function fetchPrivateInfo() {
    try {
      let userID;
      await AsyncStorage.getItem("@userData").then((res) => {
        userID = res ? JSON.parse(res).id : route.params.id;
        setUser(JSON.parse(res));
      });

      await db
        .collection("users")
        .doc(userID)
        .get()
        .then(async (snapshot) => {
          if (snapshot.exists) {
            setUser({...snapshot.data(), id: userID});
          }
          await fetchDriverOrdersAPI(snapshot.id).then((orders) => {
            setSelfOrder(
              orders.docs.map((doc) => {
                return { key: doc.id, ...doc.data() };
              })
            );
          });
        });

      await getAssignedOrders(userID ? userID : route.params.id);
    } catch (error) {
      console.log(error);
    }
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

  async function getAssignedOrders(id) {
    await fetchDriverOrdersAPI(id).then((orders) => {
      setSelfOrder(
        orders.docs.map((doc) => {
          return { key: doc.id, ...doc.data() };
        })
      );
    });
  }

  async function refresh() {
    await fetchPrivateInfo();
    await getUnassignedOrders();
  }

  useEffect(() => {
    refresh();
  }, []);

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
          <OrderList user={user} data={order} updateCallback={refresh}></OrderList>
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
          <OrderList user={user} data={selfOrder} updateCallback={refresh}></OrderList>
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
