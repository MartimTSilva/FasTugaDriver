import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text } from "react-native-paper";
import { theme } from "../core/theme";
import { getOrderStatusText } from "../stores/orders";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import Maps from "../components/Maps";

export default function OrderDetails({ route, navigation }) {
  const [customer, setCustomer] = useState({});

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
    <ScrollView>
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
      </Card>
      <Maps order={route.params} customer={customer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
