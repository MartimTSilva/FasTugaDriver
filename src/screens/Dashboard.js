import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import {
  Card,
  Divider,
  ProgressBar,
  Button,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";
import { SafeAreaView, StyleSheet } from "react-native";
import { db } from "../../firebase";
import {
  DELIVERY_PROBLEM,
  fetchDriverOrdersAPI,
  fetchUnassignedOrdersAPI,
  updateOrderAPI,
} from "../stores/orders";
import { theme } from "../core/theme";
import TextInput from "../components/TextInput";

export default function Dashboard({ route, navigation }) {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);
  const [selfOrder, setSelfOrder] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [justification, setJustification] = useState("");
  const [orderBeingCancelled, setOrderBeingCancelled] = useState(null);

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
            setUser({ ...snapshot.data(), id: userID });
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

  async function cancelOrder() {
    await updateOrderAPI(orderBeingCancelled, DELIVERY_PROBLEM, user.id, justification)
      .catch((error) => console.log(error))
      .finally(() => {
        hideDialog();
        setJustification("");
        setOrderBeingCancelled(null)
        refresh()
      });
  }

  function showCancelationDialog(order) {
    setOrderBeingCancelled(order);
    showDialog();
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
          <OrderList
            user={user}
            data={order}
            updateCallback={refresh}
            cancelCallback={showCancelationDialog}
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
            user={user}
            data={selfOrder}
            updateCallback={refresh}
            cancelCallback={showCancelationDialog}
          ></OrderList>
        </Card.Content>
      </Card>

      <Provider>
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={hideDialog}
            style={{ marginBottom: 200 }}
          >
            <Dialog.Title>Cancel Order</Dialog.Title>
            <Dialog.Content>
              <TextInput
                value={justification}
                label="Justification"
                onChangeText={(text) => setJustification(text)}
              ></TextInput>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cancelOrder}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
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
