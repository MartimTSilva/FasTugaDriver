import { StyleSheet, ScrollView, View } from "react-native";
import { Card } from "react-native-paper";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import StatisticsCard from "../components/StatisticsCard";
import { getTime } from "../utils/statisticsUtil";

const UNAVAILABLE_TEXT = "N/A";

export default function OrderDetails({ route }) {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await fetchStatistics();
      setLoading(false);
    })();
  }, []);

  async function fetchStatistics() {
    const unssOrdersQuery = query(
      collection(db, "statistics"),
      where("driver", "==", route.params.id)
    );

    await getDocs(unssOrdersQuery).then((res) => {
      setStatistics(
        res.docs.map((doc) => {
          return { ...doc.data() };
        })[0]
      );
    });
  }

  return (
    <ScrollView>
      <View style={{ ...styles.cardRow, marginTop: 10 }}>
        <StatisticsCard
          data={{
            title: "Earnings 💲",
            value: statistics
              ? `${statistics.total_earnings}€`
              : UNAVAILABLE_TEXT,
            isLoading: loading,
          }}
        />
        <StatisticsCard
          data={{
            title: "Deliveries 📦",
            value: statistics
              ? `${statistics.total_finished_deliveries}/${
                  statistics.total_finished_deliveries +
                  statistics.total_canceled_deliveries
                }`
              : UNAVAILABLE_TEXT,
            isLoading: loading,
          }}
        />
      </View>
      <View style={styles.cardRow}>
        <StatisticsCard
          data={{
            title: "Avg. Deliery Time 🚚",
            value: statistics
              ? getTime(statistics.avg_delivery_time)
              : UNAVAILABLE_TEXT,
            isLoading: loading,
          }}
        />
        <StatisticsCard
          data={{
            title: "Time Spent ⏳",
            value: statistics
              ? getTime(statistics.total_time)
              : UNAVAILABLE_TEXT,
            isLoading: loading,
          }}
        />
      </View>
      <View style={styles.cardRow}>
        <StatisticsCard
          data={{
            title: "Distinct Clients 👨‍👩‍👧‍👧",
            value: statistics
              ? statistics.total_different_clients
              : UNAVAILABLE_TEXT,
            isLoading: loading,
          }}
        />
        <StatisticsCard
          data={{
            title: "Furthest Delivery 🚀",
            value: statistics
              ? `${statistics.furthest_distance}km`
              : UNAVAILABLE_TEXT,
            isLoading: loading,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
  },
});
