import { View, StyleSheet } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { theme } from "../core/theme";
import { getOrderStatusText } from "../stores/orders";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

export default function OrderDetails({ route, navigation }) {
  const [customer, setCustomer] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  async function fetchCustomerData() {
    await db
      .collection("customers")
      .doc(route.params.customer)
      .get()
      .then(async (res) => {
        if (res.exists) setCustomer(await res.data());
      });
  }

  return (
    <View>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Order ID</Text>
        <Text style={styles.cardText}>{route.params.key}</Text>

        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.cardText}>
          {getOrderStatusText(route.params.status)}
        </Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.cardTitle}>Quantity</Text>
            <Text style={styles.cardText}>
              {route.params.number_items} items
            </Text>
          </View>

          <View style={{ marginLeft: 64 }}>
            <Text style={styles.cardTitle}>Price</Text>
            <Text style={styles.cardText}>{route.params.price}€</Text>
          </View>
        </View>

        <Divider style={{ marginTop: 17 }} />

        <Text style={styles.cardTitle}>Customer Name</Text>
        <Text style={styles.cardText}>
          {customer ? customer.name : "Loading.."}
        </Text>

        <Text style={styles.cardTitle}>Customer Address</Text>
        <Text style={styles.cardText}>
          {customer ? customer.address : "Loading.."}
        </Text>
      </Card>
      <Card style={styles.card}></Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginHorizontal: 20,
    marginTop: 14,
  },

  cardTitle: {
    color: theme.colors.primary,
    fontSize: 17,
    paddingTop: 14,
    fontWeight: "600",
  },

  cardText: {
    fontWeight: "700",
    fontSize: 14.5,
    color: "#4f5d5e",
  },

  row: {
    flexDirection: "row",
    overflow: "hidden",
  },
});
